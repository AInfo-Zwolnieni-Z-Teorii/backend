require("dotenv").config();

const { Router } = require("express");
const { body, validationResult, matchedData } = require("express-validator");

const User = require("../../database/schemas/user");
const { comparePassword } = require("../../utils/sanitizeData");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../../utils/jwt");

const router = new Router();

router.post(
	"/api/auth/login",
	// Email validation
	body("email")
		.trim()
		.isEmail()
		.withMessage("Email jest nieprawidłowy")
		.isLength({ max: 254 })
		.withMessage("Email może mieć maksymalnie 254 znaków"),

	// Password validation
	body("password")
		.trim()
		.notEmpty()
		.withMessage("Hasło jest wymagane")
		.isString()
		.withMessage("Hasło musi być tekstem")
		.isLength({ min: 1, max: 300 })
		.withMessage("Hasło musi mieć długość do 300 znaków"),

	async (req, res) => {
		// Validation results
		const results = validationResult(req);

		// Check for incorrect data
		if (!results.isEmpty()) {
			return res.status(400).json({ errors: results.array() });
		}

		// Getting data
		const { email, password } = matchedData(req);

		// Searching user
		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(401).json({
				errors: [{ msg: "Użytkownik o takim adresie e-mail nie istnieje" }],
			});
		}

		// Checking password
		if (!comparePassword(password, user.password)) {
			return res.status(401).json({
				errors: [{ msg: "Podane hasło jest nieprawidłowe" }],
			});
		}

		// Authorization - JWT
		// Creating user to save
		const savedUser = {
			id: user._id,
		};

		// Creating access token
		const accessToken = generateAccessToken(savedUser);

		// Creating refresh token
		const refreshToken = await generateRefreshToken(savedUser);
		if (!refreshToken) return res.sendStatus(500);

		// Saving token in cookies
		res
			.cookie("accesstoken", accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "development" ? false : true,
				sameSite: "Strict",
				maxAge: process.env.JWT_ACCESS_LIFETIME * 60 * 1000,
			})
			.cookie("refreshtoken", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "development" ? false : true,
				sameSite: "Strict",
				maxAge: process.env.JWT_REFRESH_LIFETIME * 60 * 1000,
			})
			.sendStatus(200);
	}
);

module.exports = router;
