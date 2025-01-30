const { Router } = require("express");
const { param, validationResult, matchedData } = require("express-validator");
const { Post } = require("../../database/schemas/post");
const { transformPost } = require("../../utils/transformPost");

const router = new Router();

router.get(
	"/api/posts/full/:slug",
	// Slug validation
	param("slug")
		.notEmpty()
		.withMessage("Slug jest wymagany")
		.isString()
		.withMessage("Slug musi być tekstem")
		.isLength({ min: 1, max: 100 })
		.withMessage("Slug musi mieć długość od 1 do 100 znaków")
		.matches(/^[a-z0-9-]+$/)
		.withMessage("Slug może zawierać jedynie małe litery, cyfry i myślniki")
		.withMessage("Tekst może zawierać tylko litery i myślniki"),
	async (req, res) => {
		// Walidation results
		const resutls = validationResult(req);

		// Check for incorrect data
		if (!resutls.isEmpty()) {
			return res.status(400).json({ errors: resutls.array() });
		}

		// Getting slug
		const { slug } = matchedData(req);

		try {
			// Getting the post and upadating views
			const post = await Post.findOneAndUpdate(
				{ slug: slug },
				{ $inc: { views: 1 } },
				{ new: true }
			)
				.populate("contentBlocks")
				.populate("introduction")
				.populate("tableOfContents")
				.populate("author")
				.populate("category");

			if (!post) {
				return res
					.status(404)
					.json({ error: "Post o podanych danych nie istnieje!" });
			}

			// Restructuring data
			const rectructuredPost = transformPost(post);

			// Sending back data
			res.status(200).json(rectructuredPost);
		} catch (err) {
			console.log(err);

			res
				.status(500)
				.json({ msg: "Błąd serwera. Proszę spróbować ponownie później." });
		}
	}
);

module.exports = router;
