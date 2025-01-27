const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			minLength: 1,
			maxLength: 100,
			required: true,
			index: true,
			unique: true,
		},

		// Slug is the URL-friendly version of the post title
		slug: {
			type: String,
			minLength: 1,
			maxLength: 50,
			required: true,
			unique: true,
			index: true,
		},

		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},

		category: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Category",
				required: true,
				index: true,
			},
		],

		thumbnailName: {
			type: String,
			minLength: 5,
			maxLength: 200,
			required: true,
		},

		ytIframeLink: {
			type: String,
			minLength: 7,
			maxLength: 500,
		},

		content: {
			type: String,
			minLength: 1,
			maxLength: 500000,
			required: true,
		},

		isMainFeatured: {
			type: Boolean,
			default: false,
			required: true,
			required: true,
		},

		views: {
			type: Number,
			default: 0,
			min: 0,
			max: 1000000000,
			minLength: 1,
			maxLength: 1000,
			required: true,
		},
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
