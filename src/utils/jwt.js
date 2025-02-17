require("dotenv").config();

const jwt = require("jsonwebtoken");
const RefreshToken = require("../database/schemas/refreshToken");

/**
 * Generates a JSON Web Token (JWT) for the given user.
 *
 * @param {Object} user - The user information to be encoded in the token.
 * @returns {string} - The generated access token with a 15-minute expiration.
 */

const generateAccessToken = (user) => {
	return jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
		expiresIn: `${process.env.JWT_ACCESS_LIFETIME}m`,
	});
};

/**
 * Generates a JSON Web Token (JWT) for the given user, and saves it
 * into the database as a refresh token.
 *
 * @param {Object} user - The user information to be encoded in the token.
 * @returns {string} - The generated refresh token with a 30-day expiration.
 */
const generateRefreshToken = async (user) => {
	// Generating token
	const token = jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
		expiresIn: `${process.env.JWT_REFRESH_LIFETIME}m`,
	});

	// Saving it to db
	const newRefreshToken = new RefreshToken({
		userId: user.id,
		refreshToken: token,
	});

	try {
		await newRefreshToken.save();
	} catch (err) {
		console.log(err);
		return false;
	}

	return token;
};

/**
 * Verifies the access token in the request cookies and adds the user to the req
 * object if it is valid.
 *
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 * @param {Function} next - The next middleware to call if the token is valid.
 */
const authMiddleware = (req, res, next) => {
	// Getting access token from cookies
	const accessToken = req.cookies.accesstoken;

	// Check for no access token
	if (!accessToken) {
		return res.status(401).send({ errors: [{ msg: "Brak tokenu dostępu" }] });
	}

	// Veryfing token
	jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, user) => {
		if (err)
			return res
				.status(401)
				.send({ errors: [{ msg: "Token dostępu nie jest prawidłowy" }] });
		req.user = user;
		next();
	});
};

module.exports = { generateAccessToken, generateRefreshToken, authMiddleware };
