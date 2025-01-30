const { Router } = require("express");
const {
	Post,
	Introduction,
	TextBlock,
	ImageBlock,
	ImageTextBlock,
	TableOfContents,
} = require("../../database/schemas/post");
const { transformPost } = require("../../utils/transformPost");

const router = new Router();

router.get("/api/posts/featured", async (req, res) => {
	try {
		const featuredPosts = [];
		let ammount = process.env.CONST_FEATURED_AMMOUNT || 6;

		if (ammount <= 0) return res.status(200).send({ posts: featuredPosts });

		// Featured post
		const featured = await Post.findOne({
			isMainFeatured: true,
		})
			.populate("author")
			.populate("category");

		if (featured) {
			const transformedPost = transformPost(featured, true);
			transformedPost.featured = true;
			featuredPosts.push(transformedPost);
			ammount--;
		}

		if (ammount <= 0) return res.status(200).send({ posts: featuredPosts });

		// Most viewed posts
		const mostViewed = await Post.find()
			.sort({ views: -1 })
			.limit(process.env.CONST_FEATURED_MOST_VIEWED || 2)
			.populate("author")
			.populate("category");

		mostViewed.forEach((post) => {
			featuredPosts.push(transformPost(post, true));
			ammount--;
		});

		if (ammount <= 0) return res.status(200).send({ posts: featuredPosts });

		// Random post (id)
		const randomID = await Post.aggregate([
			{ $sample: { size: parseInt(process.env.CONST_FEATURED_RANDOM) || 1 } },
		]);

		const random = await Post.find({ _id: { $in: randomID } })
			.populate("author")
			.populate("category");

		random.forEach((post) => {
			featuredPosts.push(transformPost(post, true));
			ammount--;
		});

		if (ammount <= 0) return res.status(200).send({ posts: featuredPosts });

		// Most recent posts
		const mostRecent = await Post.find()
			.sort({ updatedAt: -1 })
			.limit(ammount)
			.populate("author")
			.populate("category");

		mostRecent.forEach((post) => {
			featuredPosts.push(transformPost(post, true));
		});

		return res.status(200).send({ posts: featuredPosts });
	} catch (err) {
		console.log(err);

		return res.status(500).send({
			msg: "Wewnętrzny błąd serwera. Proszę spróbować ponownie później.",
		});
	}
});

module.exports = router;
