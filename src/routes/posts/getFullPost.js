const { Router } = require("express");
const Post = require("../../database/schemas/post");
const { transformPost } = require("../../utils/transformPost");

const router = new Router();

router.get("/api/posts/:slug", async (req, res) => {
	const { slug } = req.params;

	try {
		// Getting the post
		const post = await Post.findOne({ slug: slug })
			.populate("author")
			.populate("category");

		// If there is no post
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
});

module.exports = router;
