require("dotenv").config();

const mongoose = require("mongoose");

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
