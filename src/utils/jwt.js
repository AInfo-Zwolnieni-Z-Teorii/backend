require("dotenv").config();

const jwt = require("jsonwebtoken");
const RefreshToken = require("../database/schemas/refreshToken");
const User = require("../database/schemas/user");

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

/**
 * Middleware to check if the authenticated user is an admin.
 *
 * Retrieves the user ID from the request object and queries the database
 * to find the user. If the user is an admin, the request proceeds to the
 * next middleware or route handler. Otherwise, it sends a 403 Forbidden
 * status.
 *
 * In case of any errors during the database query, a 500 Internal Server
 * Error status is sent.
 *
 * @param {Object} req - The Express.js request object, containing user information.
 * @param {Object} res - The Express.js response object.
 * @param {Function} next - The next middleware function to call if the user is an admin.
 */

const isAdminMiddleware = async (req, res, next) => {
	// Getting id
	const id = req.user.id;
	if (!id || id == null) return res.sendStatus(403);

	// Getting user
	try {
		const user = await User.findOne({ _id: id });

		// Is admin
		if (user.isAdmin) return next();
		else return res.sendStatus(403);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
};

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	authMiddleware,
	isAdminMiddleware,
};
