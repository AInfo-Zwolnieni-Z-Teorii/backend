require("dotenv").config();

const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the MONGODB_URI environment variable.
 * If the connection is successful, calls the next middleware.
 * If the connection fails, sends a 500 error with a message indicating the error.
 *
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 * @param {Function} next - The next middleware to call if the connection is successful.
 */
const dbConnect = async (req, res, next) => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		console.log("Connected to MongoDB");

		next();
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error);
		return res
			.status(500)
			.json({ error: "Błąd połączenia z bazą danych", msg: error });
	}
};

module.exports = dbConnect;
