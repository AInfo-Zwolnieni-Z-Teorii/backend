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

	body("thumbnailName")
		.isString()
		.withMessage("Nazwa miniatury musi być ciągiem znaków")
		.notEmpty()
		.withMessage("Nazwa miniatury nie może być pusta")
		.isLength({ min: 5, max: 200 })
		.withMessage("Nazwa miniatury musi mieć od 5 do 200 znaków")
		.matches(/^[^\\\/:*?"<>|]+(?:\.[a-zA-Z0-9]+)?$/),

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
		.custom((content) => {
			content.forEach((block, index) => {
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
						if (typeof block.src !== "string" || !block.src.trim()) {
							throw new Error(
								`Blok ${index}: src musi być niepustym ciągiem znaków`
							);
						}
						if (block.src.length < 1 || block.src.length > 300) {
							throw new Error(
								`Blok ${index}: src musi mieć od 1 do 300 znaków`
							);
						}
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
							typeof block.image.src !== "string" ||
							!block.image.src.trim()
						) {
							throw new Error(
								`Blok ${index}: image.src musi być niepustym ciągiem znaków`
							);
						}
						if (block.image.src.length < 1 || block.image.src.length > 300) {
							throw new Error(
								`Blok ${index}: image.src musi mieć od 1 do 300 znaków`
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
