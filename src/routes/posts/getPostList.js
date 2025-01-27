const { Router } = require("express");
const Post = require("../../database/schemas/post");
const { transformPost } = require("../../utils/transformPost");

const router = new Router();

router.get("/api/posts", async (req, res) => {
	const { limit } = req.query;

	try {
		// Getting posts
		const posts = await Post.find()
			.populate("author")
			.populate("category")
			.limit(limit);

		// Check if there are any posts
		if (!posts || posts.length === 0) {
			return res.status(404).json({ error: "Nie znaleziono żadnych postów!" });
		}

		// Restructuring data
		const rectructuredPosts = posts.map((post) => transformPost(post));

		// Sending back data
		return res.status(200).json(rectructuredPosts);
	} catch (err) {
		console.log(err);
		return res
			.status(500)
			.json({ error: "Błąd serwera. Proszę spróbować ponownie później." });
	}
});

module.exports = router;
