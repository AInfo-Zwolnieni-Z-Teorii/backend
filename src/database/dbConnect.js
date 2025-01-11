require("dotenv").config();

const mongoose = require("mongoose");

/**
 * Establishes a connection to the MongoDB database using the MONGODB_URI
 * from environment variables. Logs a success message upon connection,
 * and logs an error message and exits the process if the connection fails.
 */

const dbConnect = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error);
		process.exit(1);
	}
};

module.exports = dbConnect;
