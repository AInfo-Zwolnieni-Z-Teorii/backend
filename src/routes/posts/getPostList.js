const { Router } = require("express");
const { query, validationResult, matchedData } = require("express-validator");

// Mongoose scheamas
const {
	Post,
	Introduction,
	TextBlock,
	ImageBlock,
	ImageTextBlock,
	TableOfContents,
} = require("../../database/schemas/post");
const User = require("../../database/schemas/user");
const Category = require("../../database/schemas/category");

const { transformPost } = require("../../utils/transformPost");

const router = new Router();

router.get(
	"/api/posts",
	// Limit validation
	query("limit")
		.notEmpty()
		.withMessage("Limit jest wymagany")
		.isLength({ min: 1, max: 100 })
		.withMessage("Limit musi mieć długość od 1 do 100 znaków")
		.isInt({ min: 1, max: Number.MAX_SAFE_INTEGER })
		.withMessage("Limit musi być liczbą całkowitą dodatnią"),
	async (req, res) => {
		// Validation results
		const resutls = validationResult(req);

		// Check for incorrect data
		if (!resutls.isEmpty()) {
			return res.status(400).json({ errors: resutls.array() });
		}

		// Getting limit
		const { limit } = matchedData(req);

		try {
			// Getting posts
			const posts = await Post.find()
				.populate("author")
				.populate("category")
				.limit(limit);

			// Check if there are any posts
			if (!posts || posts.length === 0) {
				return res
					.status(404)
					.json({ error: "Nie znaleziono żadnych postów!" });
			}

			// Restructuring data
			const rectructuredPosts = posts.map((post) => transformPost(post, true));

			// Sending back data
			return res.status(200).json(rectructuredPosts);
		} catch (err) {
			console.log(err);
			return res
				.status(500)
				.json({ error: "Błąd serwera. Proszę spróbować ponownie później." });
		}
	}
);

module.exports = router;
