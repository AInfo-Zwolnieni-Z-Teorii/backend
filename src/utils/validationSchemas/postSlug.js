const { param } = require("express-validator");

const postSlugValidator = [
	param("slug")
		.notEmpty()
		.withMessage("Slug jest wymagany")
		.isString()
		.withMessage("Slug musi być tekstem")
		.isLength({ min: 1, max: 100 })
		.withMessage("Slug musi mieć długość od 1 do 100 znaków")
		.matches(/^[a-z0-9-]+$/)
		.withMessage("Slug może zawierać jedynie małe litery, cyfry i myślniki")
		.withMessage("Tekst może zawierać tylko litery i myślniki"),
];

module.exports = postSlugValidator;
