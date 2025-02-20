const { Router } = require("express");
const Category = require("../../database/schemas/category");

const router = new Router();

router.get("/api/categories", async (req, res) => {
	try {
		// Getting categories by posts assigned to them
		const categories = await Category.aggregate([
			{
				$lookup: {
					from: "posts",
					localField: "_id",
					foreignField: "category",
					as: "posts",
				},
			},
			{
				$addFields: {
					postCount: { $size: "$posts" },
				},
			},
			{
				$sort: { postCount: -1 },
			},
			{
				$project: {
					name: 1,
					slug: 1,
					postCount: 1,
				},
			},
		]);

		const transformedCategories = categories.map((category) => ({
			name: category.name,
			slug: category.slug,
		}));

		res.status(200).send(transformedCategories);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
});

module.exports = router;
