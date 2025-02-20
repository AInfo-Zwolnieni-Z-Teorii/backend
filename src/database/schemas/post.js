const mongoose = require("mongoose");

// Schema of post introduction
// Related with _id with the main post (like contentBlocks)
const IntroductionSchema = new mongoose.Schema({
	header: {
		type: String,
		required: [true, "Nagłówek wstępu jest wymagany"],
		minLength: [1, "Nagłówek wstępu musi mieć co najmniej 1 znak"],
		maxLength: [100, "Nagłówek wstępu nie może być dłuższy niż 100 znaków"],
	},

	content: {
		type: String,
		required: [true, "Treść wstępu jest wymagana"],
		minLength: [1, "Treść wstępu musi mieć co najmniej 1 znak"],
		maxLength: [1000, "Treść wstępu nie może być dłuższa niż 1000 znaków"],
	},
});

const Introduction = mongoose.model("Introduction", IntroductionSchema);

// Table of contents
const TableOfContentsSchema = new mongoose.Schema(
	{
		content: {
			type: [
				{
					header: {
						type: String,
						required: [true, "Nagłówek jest wymagany"],
						minLength: [1, "Nagłówek musi mieć co najmniej 1 znak"],
						maxLength: [200, "Nagłówek nie może być dłuższy niż 200 znaków"],
					},

					anchor: {
						type: String,
						required: [true, "Link jest wymagany"],
						minLength: [1, "Link musi mieć co najmniej 1 znak"],
						maxLength: [200, "Link nie może być dłuższy niż 200 znaków"],
					},
				},
			],
			required: [true, "Spis treści jest wymagany"],
		},
	},
	{ collection: "tablesofcontents" }
);

const TableOfContents = mongoose.model(
	"TableOfContents",
	TableOfContentsSchema
);

// Main (abstract) schema for content blocks
const contentBlockSchema = new mongoose.Schema({
	type: {
		type: String,
		required: [true, "Typ bloku jest wymagany"],
		enum: {
			values: ["text", "image", "image-text"],
			message: "Typ bloku musi być jednym z: text, image, image-text",
		},
	},
});

const ContentBlock = mongoose.model("ContentBlock", contentBlockSchema);

// Extended schemas for content blocks
const TextBlock = ContentBlock.discriminator(
	"TextBlock",
	new mongoose.Schema({
		data: {
			header: {
				type: String,
				required: [true, "Nagłówek jest wymagany"],
				minLength: [1, "Nagłówek musi mieć co najmniej 1 znak"],
				maxLength: [200, "Nagłówek nie może być dłuższy niż 200 znaków"],
			},
			paragraph: {
				type: String,
				required: [true, "Treść akapitu jest wymagana"],
				minLength: [1, "Treść akapitu musi mieć co najmniej 1 znak"],
				maxLength: [3000, "Treść akapitu nie może być dłuższa niż 3000 znaków"],
			},

			// anchor to associate links in table of contents to sections
			anchor: {
				type: String,
				required: [true, "Kotwica (anchor) do nagłówka jest wymagany"],
				minLength: [1, "Kotwica (anchor) musi mieć co najmniej 1 znak"],
				maxLength: [
					100,
					"Kotwica (anchor) nie może być dłuższy niż 100 znaków",
				],
			},
		},
	})
);

const ImageBlock = ContentBlock.discriminator(
	"ImageBlock",
	new mongoose.Schema({
		data: {
			src: {
				type: String,
				required: [true, "Adres URL obrazu jest wymagany"],
				minLength: [1, "Adres URL obrazu musi mieć co najmniej 1 znak"],
				maxLength: [
					300,
					"Adres URL obrazu nie może być dłuższy niż 300 znaków",
				],
			},
			alt: {
				type: String,
				required: [true, "Opis obrazu (alt) jest wymagany"],
				minLength: [1, "Opis obrazu musi mieć co najmniej 1 znak"],
				maxLength: [300, "Opis obrazu nie może być dłuższy niż 300 znaków"],
			},
		},
	})
);

const ImageTextBlock = ContentBlock.discriminator(
	"ImageTextBlock",
	new mongoose.Schema({
		data: {
			image: {
				src: {
					type: String,
					required: [true, "Adres URL obrazu jest wymagany"],
					minLength: [1, "Adres URL obrazu musi mieć co najmniej 1 znak"],
					maxLength: [
						300,
						"Adres URL obrazu nie może być dłuższy niż 300 znaków",
					],
				},
				alt: {
					type: String,
					required: [true, "Opis obrazu (alt) jest wymagany"],
					minLength: [1, "Opis obrazu musi mieć co najmniej 1 znak"],
					maxLength: [300, "Opis obrazu nie może być dłuższy niż 300 znaków"],
				},
			},
			text: [
				{
					header: {
						type: String,
						required: [true, "Nagłówek tekstu jest wymagany"],
						minLength: [1, "Nagłówek musi mieć co najmniej 1 znak"],
						maxLength: [200, "Nagłówek nie może być dłuższy niż 200 znaków"],
					},
					paragraph: {
						type: String,
						required: [true, "Treść akapitu jest wymagana"],
						minLength: [1, "Treść akapitu musi mieć co najmniej 1 znak"],
						maxLength: [
							3000,
							"Treść akapitu nie może być dłuższa niż 3000 znaków",
						],
					},
					anchor: {
						type: String,
						required: [true, "Anchor do nagłówka jest wymagany"],
						minLength: [1, "Anchor musi mieć co najmniej 1 znak"],
						maxLength: [100, "Anchor nie może być dłuższy niż 100 znaków"],
					},
				},
			],
			layout: {
				type: String,
				enum: {
					// left - img on left, right - img on right
					values: ["left", "right"],
					message:
						"Układ obrazu musi być jednym z: left (obraz po lewej), right (obraz po prawej)",
				},
				required: [true, "Układ obrazu jest wymagany"],
			},
		},
	})
);

// Main post schema width all fields
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
			maxLength: [100, "Slug nie może być dłuższy niż 100 znaków"],
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

		// Relation to Introductions collection
		introduction: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Introduction",
			required: [true, "Wstęp do postu jest wymagany"],
		},

		// Relation to ContentBlocks colletion
		contentBlocks: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "ContentBlock",
				required: [true, "Zawartość postu jest wymagana"],
			},
		],

		isMainFeatured: {
			type: Boolean,
			default: false,
			required: [
				true,
				"Określenie, czy jest to główny post wyróżniony, jest wymagane",
			],
		},

		tableOfContents: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "TableOfContents",
			required: [true, "Spis treści jest wymagany"],
		},

		views: {
			type: Number,
			default: 0,
			min: [0, "Liczba wyświetleń nie może być mniejsza niż 0"],
			max: [1000000000, "Liczba wyświetleń nie może przekroczyć 1 miliarda"],
		},
	},
	{ timestamps: true }
);

// Middleware to delete all related data when post is deleted
postSchema.pre("findOneAndDelete", async function (next) {
	try {
		const post = await this.model.findOne(this.getFilter());

		if (!post) return next();

		await Introduction.deleteOne({ _id: post.introduction });

		await ContentBlock.deleteMany({ _id: { $in: post.contentBlocks } });

		await TableOfContents.deleteOne({ _id: post.tableOfContents });

		next();
	} catch (err) {
		next(err);
	}
});

const Post = mongoose.model("Post", postSchema);

module.exports = {
	Post,
	Introduction,
	TextBlock,
	ImageBlock,
	ImageTextBlock,
	TableOfContents,
};
