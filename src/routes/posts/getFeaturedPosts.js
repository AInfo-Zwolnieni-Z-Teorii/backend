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
		// Storing added post ids to avoid duplicates in featured
		const addedPostsIds = new Set();
		let ammount = process.env.CONST_FEATURED_AMMOUNT || 6;
		const maxAmount = ammount;
		let mostViewedAmount = process.env.CONST_FEATURED_MOST_VIEWED || 2;
		let randomAmount = process.env.CONST_FEATURED_RANDOM || 1;

		if (ammount <= 0) return res.status(200).send({ posts: featuredPosts });

		// Featured post
		const featured = await Post.findOne({
			isMainFeatured: true,
		})
			.populate("author")
			.populate("category");

		if (featured && !addedPostsIds.has(featured._id)) {
			const transformedPost = transformPost(featured, true);
			transformedPost.featured = true;
			featuredPosts.push(transformedPost);
			addedPostsIds.add(featured._id.toString()); // adding ID to set (avoid duplicates)
			ammount--;
		}

		if (ammount <= 0) return res.status(200).send({ posts: featuredPosts });

		// Most viewed posts
		const mostViewed = await Post.find()
			.sort({ views: -1 })
			.limit(maxAmount) // to avoid duplicates (choosing only unique posts)
			.populate("author")
			.populate("category");

		// Iterating through most viewed posts until post isn't already added
		for(const post of mostViewed) {
			if (addedPostsIds.has(post._id.toString())) continue;
			else {
				featuredPosts.push(transformPost(post, true));
				addedPostsIds.add(post._id.toString());
				ammount--;
				mostViewedAmount--;
				if(mostViewedAmount <= 0) break;
			}
		}
			
		if (ammount <= 0) return res.status(200).send({ posts: featuredPosts });

		// Random post (id)
		const randomID = await Post.aggregate([
			{ $sample: { size: parseInt(process.env.CONST_FEATURED_RANDOM) || 1 } },
		]);

		const random = await Post.find({ _id: { $in: randomID } })
			.limit(maxAmount)
			.populate("author")
			.populate("category");

		for(const post of random) {
			if(addedPostsIds.has(post._id.toString())) continue;
			else {
				featuredPosts.push(transformPost(post, true));
				addedPostsIds.add(post._id.toString());
				ammount--;
				randomAmount--;
				if(randomAmount <= 0) break;
			}
		}

		if (ammount <= 0) return res.status(200).send({ posts: featuredPosts });

		// Most recent posts
		const mostRecent = await Post.find()
			.sort({ updatedAt: -1 })
			.limit(maxAmount)
			.populate("author")
			.populate("category");

		for(const post of mostRecent) {
			if(addedPostsIds.has(post._id.toString())) continue;
			else {
				featuredPosts.push(transformPost(post, true));
				addedPostsIds.add(post._id.toString());
				ammount--;
				if(ammount <= 0) break;
			}
		};

		return res.status(200).send({ posts: featuredPosts });
	} catch (err) {
		console.log(err);

		return res.status(500).send({
			msg: "Wewnętrzny błąd serwera. Proszę spróbować ponownie później.",
		});
	}
});

module.exports = router;
