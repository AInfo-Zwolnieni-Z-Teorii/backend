const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 1,
		maxLength: 100,
		required: true,
		unique: true,
	},

	// Slug is the URL-friendly version of the category name
	slug: {
		type: String,
		minLength: 1,
		maxLength: 50,
		required: true,
		unique: true,
		index: true,
	},
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
