const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			minLength: 1,
			maxLength: 100,
			required: true,
			unique: true,
			index: true,
		},

		// Slug is the URL-friendly version of the username
		slug: {
			type: String,
			minLength: 1,
			maxLength: 50,
			unique: true,
			index: true,
		},

		email: {
			type: String,
			minLength: 5,
			maxLength: 500,
			required: true,
			unique: true,
			index: true,
			validate: {
				validator: function (v) {
					return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
				},
				message: "Nieprawidłowy adres e-mail",
			},
		},

		password: {
			type: String,
			minLength: 1,
			maxLength: 300,
			required: true,
		},

		isAdmin: {
			type: Boolean,
			default: false,
			required: true,
		},
	},
	{ timestamps: true }
);

// Auto generating slug
userSchema.pre("save", function (next) {
	if (this.isModified("username")) {
		this.slug = this.username
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
	}
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
