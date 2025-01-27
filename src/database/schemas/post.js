const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			minLength: [1, "Tytuł musi mieć co najmniej 1 znak"],
			maxLength: [100, "Tytuł nie może być dłuższy niż 100 znaków"],
			required: [true, "Tytuł jest wymagany"],
			index: true,
			unique: [true, "Tytuł musi być unikalny"],
		},

		slug: {
			type: String,
			minLength: [1, "Slug musi mieć co najmniej 1 znak"],
			maxLength: [50, "Slug nie może być dłuższy niż 50 znaków"],
			required: [true, "Slug jest wymagany"],
			unique: [true, "Slug musi być unikalny"],
			index: true,
			match: [
				/^[a-z0-9-]+$/,
				"Slug może zawierać tylko małe litery, cyfry i myślniki",
			],
		},

		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Autor jest wymagany"],
			index: true,
		},

		category: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Category",
				required: [true, "Kategoria jest wymagana"],
				index: true,
			},
		],

		thumbnailName: {
			type: String,
			minLength: [5, "Nazwa miniaturki musi mieć co najmniej 5 znaków"],
			maxLength: [200, "Nazwa miniaturki nie może być dłuższa niż 200 znaków"],
			required: [true, "Nazwa miniaturki jest wymagana"],
			match: [
				/^[^\\\/:*?"<>|]+(?:\.[a-zA-Z0-9]+)?$/,
				"Nazwa pliku jest nieprawidłowa.",
			],
		},

		ytIframeLink: {
			type: String,
			minLength: [7, "Link do iFrame YouTube musi mieć co najmniej 7 znaków"],
			maxLength: [
				500,
				"Link do iFrame YouTube nie może być dłuższy niż 500 znaków",
			],
		},

		content: {
			type: String,
			minLength: [1, "Treść posta musi mieć co najmniej 1 znak"],
			maxLength: [500000, "Treść posta nie może być dłuższa niż 500000 znaków"],
			required: [true, "Treść posta jest wymagana"],
		},

		isMainFeatured: {
			type: Boolean,
			default: false,
			required: [
				true,
				"Określenie, czy jest to główny post wyróżniony, jest wymagane",
			],
		},

		views: {
			type: Number,
			default: 0,
			min: [0, "Liczba wyświetleń nie może być mniejsza niż 0"],
			max: [1000000000, "Liczba wyświetleń nie może przekroczyć 1 miliarda"],
			required: [true, "Liczba wyświetleń jest wymagana"],
		},
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
