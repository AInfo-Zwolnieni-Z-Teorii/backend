const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: [1, "Nazwa kategorii musi mieć co najmniej 1 znak"],
		maxLength: [100, "Nazwa kategorii nie może być dłuższa niż 100 znaków"],
		required: [true, "Nazwa kategorii jest wymagana"],
		unique: [true, "Nazwa kategorii musi być unikalna"],
	},

	slug: {
		type: String,
		minLength: [1, "Slug kategorii musi mieć co najmniej 1 znak"],
		maxLength: [50, "Slug kategorii nie może być dłuższy niż 50 znaków"],
		required: [true, "Slug kategorii jest wymagany"],
		unique: [true, "Slug kategorii musi być unikalny"],
		index: true,
		match: [
			/^[a-z0-9-]+$/,
			"Slug kategorii może zawierać tylko małe litery, cyfry i myślniki",
		],
	},
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
