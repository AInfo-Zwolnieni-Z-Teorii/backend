const { Router } = require("express");
const postSlugValidator = require("../../utils/validationSchemas/postSlug");
const { validationResult, matchedData } = require("express-validator");
const { authMiddleware, isAdminMiddleware } = require("../../utils/jwt");
const { Post } = require("../../database/schemas/post");

const router = new Router();

router.delete(
	"/api/posts/:slug",
	authMiddleware,
	isAdminMiddleware,
	postSlugValidator,
	async (req, res) => {
		// return res
		// 	.status(501)
		// 	.send("Endpoint niedostosowany po zmianie przechowywania zdjęć");

		// Validation
		const results = validationResult(req);

		if (!results.isEmpty()) {
			return res.status(400).json({ errors: results.array() });
		}

		const { slug } = matchedData(req);

		// Deleting post
		try {
			const deletedPost = await Post.findOneAndDelete({ slug: slug });

			if (!deletedPost) {
				return res.sendStatus(404);
			}

			return res.sendStatus(200);
		} catch (err) {
			console.log(err);
			return res.sendStatus(500);
		}
	}
);

module.exports = router;
