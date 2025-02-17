require("dotenv").config();
const mongoose = require("mongoose");

const refreshTokenShema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},

	refreshToken: {
		type: String,
		required: true,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
});

refreshTokenShema.index(
	{ createdAt: 1 },
	{ expireAfterSeconds: 60 * 60 * Number(process.env.JWT_REFRESH_LIFETIME) }
);

const RefreshToken = mongoose.model("RefreshToken", refreshTokenShema);

module.exports = RefreshToken;
