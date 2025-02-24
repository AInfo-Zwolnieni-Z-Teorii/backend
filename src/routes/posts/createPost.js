require("dotenv").config();

const { Router, text } = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authMiddleware, isAdminMiddleware } = require("../../utils/jwt");
const { validationResult, matchedData } = require("express-validator");
const createPostValidator = require("../../utils/validationSchemas/createPost");

const {
	Introduction,
	TextBlock,
	ImageBlock,
	ImageTextBlock,
	TableOfContents,
	Post,
} = require("../../database/schemas/post");

const Category = require("../../database/schemas/category");

const { generateAnchorSlug } = require("../../utils/sanitizeData");
const generateTableOfContents = require("../../utils/tableOfContents");
const { v4: uuidv4 } = require("uuid");

// Multer storage config
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/postsImages");
	},
	filename: (req, file, cb) => {
		const uuid = uuidv4();
		const currentDate = Date.now();
		const filename = `${currentDate}-${uuid}${path.extname(file.originalname)}`;

		// Inicjalizacja tablicy uploadedFiles jeśli nie istnieje
		if (!req.uploadedFiles) {
			req.uploadedFiles = { thumbnail: [], images: [] };
		}

		// Dodanie nazwy pliku do odpowiedniej tablicy
		req.uploadedFiles[file.fieldname].push(filename);

		cb(null, filename);
	},
});

// Filter for files
const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Nieprawidłowy format pliku"), false);
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: (process.env.MAX_FILE_SIZE_POST_IMAGE = 15 * 1024 * 1024),
	},
});

const router = new Router();

const deleteUploadedFiles = (files) => {
	if (files) {
		Object.values(files)
			.flat()
			.forEach((file) => {
				fs.unlink(path.join("public/postsImages", file), (err) => {
					if (err) console.error("Błąd podczas usuwania pliku:", err);
				});
			});
	}
};

router.post(
	"/api/posts",
	authMiddleware,
	isAdminMiddleware,
	(req, res, next) => {
		try {
			upload.fields([
				{ name: "thumbnail", maxCount: 1 },
				{ name: "images", maxCount: 20 },
			])(req, res, (err) => {
				if (err) {
					if (err instanceof multer.MulterError) {
						if (err.code === "LIMIT_FILE_SIZE") {
							deleteUploadedFiles(req.uploadedFiles);
							return res.status(400).send({
								errors: [
									{
										msg: `Maksymalny rozmiar pliku to ${
											process.env.MAX_FILE_SIZE_POST_IMAGE / (1024 * 1024)
										}MB`,
									},
								],
							});
						}
						if (err.code === "LIMIT_FILE_COUNT") {
							deleteUploadedFiles(req.uploadedFiles);
							return res.status(400).send({
								errors: [{ msg: "Przekroczono maksymalną liczbę plików" }],
							});
						}
						deleteUploadedFiles(req.uploadedFiles);
						return res.status(400).send({
							errors: [{ msg: "Błąd podczas przesyłania plików" }],
						});
					}
					if (err.message === "Nieprawidłowy format pliku") {
						deleteUploadedFiles(req.uploadedFiles);
						return res.status(400).send({
							errors: [{ msg: "Dozwolone formaty plików to: JPG, PNG, WEBP" }],
						});
					}
					deleteUploadedFiles(req.uploadedFiles);
					throw err; // Przekazujemy błąd dalej zamiast zwracać 500
				}
				next();
			});
		} catch (err) {
			console.error("Błąd podczas przesyłania plików:", err);
			deleteUploadedFiles(req.uploadedFiles);
			return res.status(500).send({
				errors: [{ msg: "Wystąpił błąd podczas przesyłania plików" }],
			});
		}
	},
	createPostValidator,
	async (req, res) => {
		// Validation
		const result = validationResult(req);
		if (!result.isEmpty()) {
			deleteUploadedFiles(req.uploadedFiles);
			return res.status(400).send({ errors: result.array() });
		}

		const data = matchedData(req);

		// Starting session + transaction
		const mongoSession = await mongoose.startSession();
		mongoSession.startTransaction();

		try {
			// Introduction
			const introduction = new Introduction({
				header: data.introduction.header,
				content: data.introduction.content,
			});

			const savedIntroduction = await introduction.save({
				session: mongoSession,
			});

			// Licznik dla zdjęć
			let imageIndex = 0;

			// Content blocks
			const contentBlocks = data.content.map((block) => {
				switch (block.type) {
					case "text":
						return new TextBlock({
							type: block.type,
							data: {
								header: block.header,
								paragraph: block.paragraph,
								anchor: generateAnchorSlug(block.header),
							},
						});
					case "image":
						const imageName = req.uploadedFiles.images[imageIndex++];
						return new ImageBlock({
							type: block.type,
							data: {
								src: imageName,
								alt: block.alt,
							},
						});
					case "image-text":
						const imageTextName = req.uploadedFiles.images[imageIndex++];
						return new ImageTextBlock({
							type: block.type,
							data: {
								image: {
									src: imageTextName,
									alt: block.image.alt,
								},
								text: block.text.map((art) => ({
									header: art.header,
									paragraph: art.paragraph,
									anchor: generateAnchorSlug(art.header),
								})),
								layout: block.layout,
							},
						});
					default:
						throw new Error(`blckTypeERR`);
				}
			});

			const savedContentBlocks = await Promise.all(
				contentBlocks.map((block) => block.save({ session: mongoSession }))
			);

			// Table of contents
			const generatedTableOfContents =
				generateTableOfContents(savedContentBlocks);

			const tableOfContents = new TableOfContents({
				content: generatedTableOfContents,
			});

			const savedTableOfContents = await tableOfContents.save({
				session: mongoSession,
			});

			// Getting author
			const author = req.user.id;

			// Getting category ids
			const categoryIds = await Promise.all(
				data.categories.map(async (category) =>
					Category.findOne({ slug: category })
						.lean()
						.then((cat) => cat?._id)
				)
			);

			if (
				!categoryIds ||
				categoryIds.length != data.categories.length ||
				categoryIds.includes(undefined)
			)
				throw new Error("ctgryERR");

			// Unset all featured if main featured is set
			if (data.mainFeatured) {
				await Post.updateMany(
					{ isMainFeatured: true },
					{ $set: { isMainFeatured: false } },
					{ session: mongoSession }
				);
			}

			// Final post
			const post = new Post({
				title: data.title,
				slug: generateAnchorSlug(data.title),
				author: author,
				category: categoryIds,
				thumbnailName: req.uploadedFiles.thumbnail[0],
				introduction: savedIntroduction._id,
				contentBlocks: savedContentBlocks.map((block) => block._id),
				tableOfContents: savedTableOfContents._id,
				isMainFeatured: !!data.mainFeatured,
				ytIframeLink: data.ytIframeLink || undefined,
			});

			const savedPost = await post.save({ session: mongoSession });

			if (!savedPost) throw new Error("Failed to save post");

			// Commiting transaction
			await mongoSession.commitTransaction();
		} catch (err) {
			// Transaction rollback
			await mongoSession.abortTransaction();
			deleteUploadedFiles(req.uploadedFiles);

			if (err.message == "ctgryERR")
				return res
					.status(400)
					.send({ errors: [{ msg: "Te kategorie nie istnieją" }] });

			if (err.message == "blckTypeERR")
				return res
					.status(400)
					.send({ errors: [{ msg: "Niepoprawny typ bloku" }] });

			if (err instanceof mongoose.Error && err.message) {
				return res.status(400).send({ errors: [{ msg: err.message }] });
			}

			console.log(err);
			return res.sendStatus(500);
		} finally {
			// Closing session
			await mongoSession.endSession();
		}

		res.sendStatus(201);
	}
);

module.exports = router;
