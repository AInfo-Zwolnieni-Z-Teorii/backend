const { Router } = require("express");
const { authMiddleware, isAdminMiddleware } = require("../../utils/jwt");
const createPostValidator = require("../../utils/validationSchemas/createPost");
const { validationResult, matchedData } = require("express-validator");
const mongoose = require("mongoose");
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
const postSlugValidator = require("../../utils/validationSchemas/postSlug");

const router = new Router();

router.put(
	"/api/posts/:slug",
	authMiddleware,
	isAdminMiddleware,
	createPostValidator,
	postSlugValidator,
	async (req, res) => {
		// Validation
		const result = validationResult(req);
		if (!result.isEmpty())
			return res.status(400).send({ errors: result.array() });

		const data = matchedData(req);

		// Getting existing post
		const oldPost = await Post.findOne({ slug: req.params.slug })
			.populate("introduction")
			.populate("contentBlocks")
			.populate("category")
			.populate("tableOfContents");
		if (!oldPost) {
			return res
				.status(404)
				.send({ errors: [{ msg: "Post o podanym slugu nie istnieje" }] });
		}

		// Starting session + transaction
		const mongoSession = await mongoose.startSession();
		mongoSession.startTransaction();

		try {
			// Update Introduction
			await Introduction.findByIdAndUpdate(
				oldPost.introduction._id,
				{
					header: data.introduction.header,
					content: data.introduction.content,
				},
				{ session: mongoSession }
			);

			// Update Content Blocks
			const updatedContentBlocks = await Promise.all(
				data.content.map(async (block, index) => {
					let updatedBlock;
					switch (block.type) {
						case "text":
							updatedBlock = await TextBlock.findByIdAndUpdate(
								oldPost.contentBlocks[index]._id,
								{
									type: block.type,
									data: {
										header: block.header,
										paragraph: block.paragraph,
										anchor: generateAnchorSlug(block.header),
									},
								},
								{ session: mongoSession, new: true }
							);
							break;
						case "image":
							updatedBlock = await ImageBlock.findByIdAndUpdate(
								oldPost.contentBlocks[index]._id,
								{
									type: block.type,
									data: {
										src: block.src,
										alt: block.alt,
									},
								},
								{ session: mongoSession, new: true }
							);
							break;
						case "image-text":
							updatedBlock = await ImageTextBlock.findByIdAndUpdate(
								oldPost.contentBlocks[index]._id,
								{
									type: block.type,
									data: {
										image: block.image,
										text: block.text.map((art) => ({
											header: art.header,
											paragraph: art.paragraph,
											anchor: generateAnchorSlug(art.header),
										})),
										layout: block.layout,
									},
								},
								{ session: mongoSession, new: true }
							);
							break;
						default:
							throw new Error("Invalid block type");
					}
					return updatedBlock;
				})
			);

			// Update Categories
			const categoryIds = await Promise.all(
				data.categories.map(async (category) =>
					Category.findOne({ slug: category }).then((cat) => cat?._id)
				)
			);

			// Unset all featured if main featured is set
			if (data.mainFeatured) {
				await Post.updateMany(
					{ isMainFeatured: true },
					{ $set: { isMainFeatured: false } },
					{ session: mongoSession }
				);
			}

			// Update Post fields
			await Post.findByIdAndUpdate(
				oldPost._id,
				{
					title: data.title,
					slug: generateAnchorSlug(data.title),
					category: categoryIds,
					thumbnailName: data.thumbnailName,
					isMainFeatured: !!data.mainFeatured,
					ytIframeLink: data.ytIframeLink || undefined,
				},
				{ session: mongoSession }
			);

			// Update Table of Contents
			const generatedTableOfContents =
				generateTableOfContents(updatedContentBlocks);
			await TableOfContents.findByIdAndUpdate(
				oldPost.tableOfContents._id,
				{ content: generatedTableOfContents },
				{ session: mongoSession }
			);

			await mongoSession.commitTransaction();
			res.sendStatus(200);
		} catch (err) {
			await mongoSession.abortTransaction();
			console.error(err);
			res.sendStatus(500);
		} finally {
			await mongoSession.endSession();
		}
	}
);

module.exports = router;
