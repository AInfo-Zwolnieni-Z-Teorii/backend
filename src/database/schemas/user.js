const mongoose = require("mongoose");
const { hashPassword, replacePolishChars } = require("../../utils/sanitizeUser");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			minLength: [1, "Nazwa użytkownika musi mieć co najmniej 1 znak"],
			maxLength: [100, "Nazwa użytkownika nie może być dłuższa niż 100 znaków"],
			required: [true, "Nazwa użytkownika jest wymagana"],
			unique: [true, "Nazwa użytkownika musi być unikalna"],
			index: true,
		},

		slug: {
			type: String,
			minLength: [1, "Slug użytkownika musi mieć co najmniej 1 znak"],
			maxLength: [50, "Slug użytkownika nie może być dłuższy niż 50 znaków"],
			unique: [true, "Slug użytkownika musi być unikalny"],
			index: true,
		},

		email: {
			type: String,
			minLength: [5, "Adres e-mail musi mieć co najmniej 5 znaków"],
			maxLength: [500, "Adres e-mail nie może być dłuższy niż 500 znaków"],
			required: [true, "Adres e-mail jest wymagany"],
			unique: [true, "Adres e-mail musi być unikalny"],
			index: true,
			match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Nieprawidłowy adres e-mail"],
		},

		password: {
			type: String,
			minLength: [1, "Hasło musi mieć co najmniej 1 znak"],
			maxLength: [300, "Hasło nie może być dłuższe niż 300 znaków"],
			required: [true, "Hasło jest wymagane"],
		},

		avatar: {
			type: String,
			minLength: [1, "Adres URL obrazu musi mieć co najmniej 1 znak"],
			maxLength: [300, "Adres URL obrazu nie może być dłuższy niż 300 znaków"],
			match: [/^(https?:\/\/.*\.(png|jpg|jpeg|gif|webp)|[a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|webp))$/, "Nieprawidłowy format obrazu"],
			required: [true, "Avatar jest wymagany"],
		},
		
		isAdmin: {
			type: Boolean,
			default: false,
			required: [true, "Określenie roli administratora jest wymagane"],
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", function (next) {
	// Auto generating slug
	if (this.isModified("username")) {
		this.slug = replacePolishChars(this.username)
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
	}

	// Hashing password
	if (this.isModified("password")) {
		this.password = hashPassword(this.password);
	}

	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
