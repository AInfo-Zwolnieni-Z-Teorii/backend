const { Router } = require("express");
const { body, validationResult, matchedData } = require("express-validator");

const sendUserSystemEmail = require("../../utils/mail/userSystemEmail");
const sendAdminSystemEmail = require("../../utils/mail/adminSystemEmail");
const router = Router();

router.post(
	"/api/contact",

	// Email validation
	body("email")
		.isEmail()
		.withMessage("Nieprawidłowy adres email")
		.normalizeEmail(),

	// Content validation
	body("content")
		.trim()
		.escape()
		.isLength({ min: 5, max: 1000 })
		.withMessage(
			"Treść wiadomości musi mieć co najmniej 5 znaków i maksymalnie 1000 znaków"
		),

	async (req, res) => {
		// Validation errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const data = matchedData(req);

		// Sending emails
		let userEmailInfo, adminEmailInfo;

		try {
			// Send user confirmation email
			userEmailInfo = await sendUserSystemEmail(data.email, data.content);
		} catch (error) {
			res.status(500).json({
				message: "Wystąpił błąd podczas wysyłania potwierdzenia do użytkownika",
			});
			console.error(error);
		}

		try {
			// Send admin email
			adminEmailInfo = await sendAdminSystemEmail(data.email, data.content);
		} catch (error) {
			res.status(500).json({
				message: "Wystąpił błąd podczas wysyłania wiadomości do administratora",
			});
			console.error(error);
		}

		res.status(200).json({
			message: "Wiadomości zostały wysłane",
			userEmailInfo,
			adminEmailInfo,
		});
	}
);

module.exports = router;
