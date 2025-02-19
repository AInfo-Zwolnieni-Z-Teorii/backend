const { Router, text } = require("express");
const mongoose = require("mongoose");
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

const router = new Router();

router.post(
	"/api/posts",
	authMiddleware,
	isAdminMiddleware,
	createPostValidator,
	async (req, res) => {
		// Validation
		const result = validationResult(req);
		if (!result.isEmpty())
			return res.status(400).send({ errors: result.array() });

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
						return new ImageBlock({
							type: block.type,
							data: {
								src: block.src,
								alt: block.alt,
							},
						});
					case "image-text":
						return new ImageTextBlock({
							type: block.type,
							data: {
								image: {
									src: block.image.src,
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
						.lean() // lean() - clean JS data, no mongoose objects
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
				thumbnailName: data.thumbnailName,
				introduction: savedIntroduction._id,
				contentBlocks: savedContentBlocks.map((block) => block._id),
				tableOfContents: savedTableOfContents._id,
				isMainFeatured: !!data.mainFeatured, // the !! converts to boolean
				ytIframeLink: data.ytIframeLink || undefined,
			});

			const savedPost = await post.save({ session: mongoSession });

			if (!savedPost) throw new Error("Failed to save post");

			// Commiting transaction
			await mongoSession.commitTransaction();
		} catch (err) {
			// Transaction rollback
			await mongoSession.abortTransaction();

			if (err.name == "ctgryERR")
				return res
					.status(400)
					.send({ errors: [{ msg: "Te kategorie nie istnieją" }] });

			if (err.name == "blckTypeERR")
				return res
					.status(400)
					.send({ errors: [{ msg: "Niepoprawny typ bloku" }] });

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
