require("dotenv").config();
const { body } = require("express-validator");

const createPostValidator = [
	body("title")
		.isString()
		.withMessage("Tytuł musi być ciągiem znaków")
		.notEmpty()
		.withMessage("Tytuł nie może być pusty")
		.isLength({ min: 1, max: 100 })
		.withMessage("Tytuł musi mieć od 1 do 100 znaków"),

	body("categories")
		.isArray()
		.withMessage("Kategorie muszą być tablicą")
		.custom((categories) => {
			categories.forEach((slug, index) => {
				if (typeof slug !== "string" || !slug.trim()) {
					throw new Error(
						`Kategoria na indeksie ${index} musi być niepustym ciągiem znaków`
					);
				}
			});
			return true;
		}),

	// Files - thumbnail
	body("thumbnail").custom((value, { req }) => {
		if (!req.files || !req.files.thumbnail || !req.files.thumbnail[0]) {
			throw new Error("Miniatura jest wymagana");
		}
		const file = req.files.thumbnail[0];

		if (file.size > process.env.MAX_FILE_SIZE_POST_IMAGE * 1024 * 1024) {
			throw new Error(
				`Rozmiar miniatury nie może przekraczać ${process.env.MAX_FILE_SIZE_POST_IMAGE}MB`
			);
		}

		const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
		if (!allowedTypes.includes(file.mimetype)) {
			throw new Error("Dozwolone formaty miniatury to: JPG, PNG, WEBP");
		}

		return true;
	}),

	// Files - images
	body("images").custom((value, { req }) => {
		if (req.files && req.files.images) {
			if (req.files.images.length > 20) {
				throw new Error("Można przesłać maksymalnie 20 zdjęć");
			}

			req.files.images.forEach((file, index) => {
				if (file.size > process.env.MAX_FILE_SIZE_POST_IMAGE * 1024 * 1024) {
					throw new Error(
						`Zdjęcie ${index + 1}: rozmiar nie może przekraczać ${
							process.env.MAX_FILE_SIZE_POST_IMAGE
						}MB`
					);
				}

				const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
				if (!allowedTypes.includes(file.mimetype)) {
					throw new Error(
						`Zdjęcie ${index + 1}: dozwolone formaty to JPG, PNG, WEBP`
					);
				}
			});
		}
		return true;
	}),

	// Validation for the introduction section
	body("introduction.header")
		.isString()
		.withMessage("Nagłówek wstępu musi być ciągiem znaków")
		.notEmpty()
		.withMessage("Nagłówek wstępu nie może być pusty")
		.isLength({ min: 1, max: 100 })
		.withMessage("Nagłówek wstępu musi mieć od 1 do 100 znaków"),

	body("introduction.content")
		.isString()
		.withMessage("Treść wstępu musi być ciągiem znaków")
		.notEmpty()
		.withMessage("Treść wstępu nie może być pusta")
		.isLength({ min: 1, max: 1000 })
		.withMessage("Treść wstępu musi mieć od 1 do 1000 znaków"),

	// Validation for content blocks
	body("content")
		.isArray()
		.withMessage("Treść musi być tablicą")
		.custom((content, { req }) => {
			let imageIndex = 0;

			content.forEach((block, index) => {
				// Increase in case of image block or image-text block
				if (block.type === "image" || block.type === "image-text") {
					imageIndex++;
				}

				// Check if block.type is a non-empty string
				if (typeof block.type !== "string" || !block.type.trim()) {
					throw new Error(
						`Blok ${index}: typ jest wymagany i musi być niepustym ciągiem znaków`
					);
				}

				// Validation based on the block type
				switch (block.type) {
					case "text":
						if (typeof block.header !== "string" || !block.header.trim()) {
							throw new Error(
								`Blok ${index}: nagłówek musi być niepustym ciągiem znaków`
							);
						}
						if (block.header.length < 1 || block.header.length > 200) {
							throw new Error(
								`Blok ${index}: nagłówek musi mieć od 1 do 200 znaków`
							);
						}
						if (
							typeof block.paragraph !== "string" ||
							!block.paragraph.trim()
						) {
							throw new Error(
								`Blok ${index}: akapit musi być niepustym ciągiem znaków`
							);
						}
						if (block.paragraph.length < 1 || block.paragraph.length > 3000) {
							throw new Error(
								`Blok ${index}: akapit musi mieć od 1 do 3000 znaków`
							);
						}
						break;

					case "image":
						if (typeof block.alt !== "string" || !block.alt.trim()) {
							throw new Error(
								`Blok ${index}: alt musi być niepustym ciągiem znaków`
							);
						}
						if (block.alt.length < 1 || block.alt.length > 300) {
							throw new Error(
								`Blok ${index}: alt musi mieć od 1 do 300 znaków`
							);
						}
						break;

					case "image-text":
						// Validation for the image field
						if (!block.image || typeof block.image !== "object") {
							throw new Error(
								`Blok ${index}: pole image jest wymagane i musi być obiektem`
							);
						}
						if (
							typeof block.image.alt !== "string" ||
							!block.image.alt.trim()
						) {
							throw new Error(
								`Blok ${index}: image.alt musi być niepustym ciągiem znaków`
							);
						}
						if (block.image.alt.length < 1 || block.image.alt.length > 300) {
							throw new Error(
								`Blok ${index}: image.alt musi mieć od 1 do 300 znaków`
							);
						}
						// Validation for the text field as an array of objects
						if (!Array.isArray(block.text) || block.text.length === 0) {
							throw new Error(
								`Blok ${index}: pole text musi być niepustą tablicą`
							);
						}
						block.text.forEach((textItem, textIndex) => {
							if (
								typeof textItem.header !== "string" ||
								!textItem.header.trim()
							) {
								throw new Error(
									`Blok ${index}, element tekstowy ${textIndex}: nagłówek musi być niepustym ciągiem znaków`
								);
							}
							if (textItem.header.length < 1 || textItem.header.length > 200) {
								throw new Error(
									`Blok ${index}, element tekstowy ${textIndex}: nagłówek musi mieć od 1 do 200 znaków`
								);
							}
							if (
								typeof textItem.paragraph !== "string" ||
								!textItem.paragraph.trim()
							) {
								throw new Error(
									`Blok ${index}, element tekstowy ${textIndex}: akapit musi być niepustym ciągiem znaków`
								);
							}
							if (
								textItem.paragraph.length < 1 ||
								textItem.paragraph.length > 3000
							) {
								throw new Error(
									`Blok ${index}, element tekstowy ${textIndex}: akapit musi mieć od 1 do 3000 znaków`
								);
							}
						});
						// Validation for the layout field
						if (
							typeof block.layout !== "string" ||
							!["left", "right"].includes(block.layout)
						) {
							throw new Error(
								`Blok ${index}: układ musi być "left" lub "right"`
							);
						}
						break;

					default:
						throw new Error(`Blok ${index}: Nieznany typ bloku: ${block.type}`);
				}
			});

			// Sprawdź czy liczba przesłanych plików zgadza się z liczbą bloków zawierających obrazy
			if (req.files?.images && imageIndex !== req.files.images.length) {
				throw new Error(
					"Liczba przesłanych plików nie zgadza się z liczbą bloków zawierających obrazy"
				);
			}

			return true;
		}),

	body("mainFeatured")
		.optional()
		.isBoolean()
		.withMessage("mainFeatured musi być wartością boolean"),

	body("ytIframeLink")
		.optional()
		.isString()
		.withMessage("ytIframeLink musi być ciągiem znaków")
		.isURL()
		.withMessage("ytIframeLink musi być poprawnym adresem URL"),
];

module.exports = createPostValidator;
