require("dotenv").config();

const { Router } = require("express");
const jwt = require("jsonwebtoken");
const RefreshTokenModel = require("../../database/schemas/refreshToken");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../../utils/jwt");

const router = new Router();

router.post("/api/auth/refresh", async (req, res) => {
	const refreshToken = req.cookies.refreshtoken.toString();

	// Check if token sent
	if (refreshToken == null || refreshToken == "")
		return res
			.status(401)
			.send({ errors: [{ msg: "Brak tokenu odnowienia" }] });

	// Veryfing with token in db
	const dbToken = await RefreshTokenModel.findOne({
		refreshToken: refreshToken,
	});

	if (!dbToken)
		return res
			.status(401)
			.send({ errors: [{ msg: "Token odnowienia jest nieprawidłowy" }] });

	const createdAt = new Date(dbToken.createdAt);
	const currentTime = new Date();
	const diffInMinutes = (currentTime - createdAt) / (1000 * 60); // diff in minutes

	if (diffInMinutes >= process.env.JWT_REFRESH_LIFETIME)
		return res
			.status(401)
			.send({ errors: [{ msg: "Token odnowienia wygasł" }] });

	// Veryfing token itself
	jwt.verify(
		refreshToken,
		process.env.JWT_REFRESH_SECRET,
		async (err, user) => {
			if (err)
				return res
					.status(401)
					.send({ errors: [{ msg: "Token odnowienia nie jest prawidłowy" }] });

			const accessToken = await generateAccessToken({ id: user.id });

			// deleting old refresh token
			try {
				await RefreshTokenModel.deleteOne({ refreshToken: refreshToken });
			} catch (err) {
				console.log(err);
			}

			// saving new refresh token
			const newRefreshToken = await generateRefreshToken({ id: user.id });
			if (!newRefreshToken) return res.sendStatus(500);

			res
				.cookie("accesstoken", accessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "development" ? false : true,
					sameSite: "Strict",
					maxAge: process.env.JWT_ACCESS_LIFETIME * 60 * 1000,
				})
				.cookie("refreshtoken", newRefreshToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "development" ? false : true,
					sameSite: "Strict",
					maxAge: process.env.JWT_REFRESH_LIFETIME * 60 * 1000,
				})
				.sendStatus(200);
		}
	);
});

module.exports = router;
