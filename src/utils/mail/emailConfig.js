const nodemailer = require("nodemailer");

/**
 * Creates and verifies a nodemailer transport configuration for Gmail
 * @async
 * @returns {Promise<nodemailer.Transporter>} A configured and verified nodemailer transporter object
 * @throws {Error} If transporter creation or verification fails
 */
const createTransporter = async () => {
	// Create transporter
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_APP_PASSWORD,
		},
		secure: true,
	});

	// Verify transporter
	try {
		await transporter.verify();
		return transporter;
	} catch (error) {
		console.error("Error creating transporter");
		console.error(error);
		throw new Error("Error creating transporter");
	}
};

module.exports = createTransporter;
