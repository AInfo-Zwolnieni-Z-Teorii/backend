const { body } = require("express-validator");

const createPostValidator = [
	body("title")
		.isString()
		.withMessage("Title must be a string")
		.notEmpty()
		.withMessage("Title cannot be empty")
		.isLength({ min: 1, max: 100 })
		.withMessage("Title must be between 1 and 100 characters"),

	body("categories")
		.isArray()
		.withMessage("Categories must be an array")
		.custom((categories) => {
			categories.forEach((slug, index) => {
				if (typeof slug !== "string" || !slug.trim()) {
					throw new Error(
						`Category at index ${index} must be a non-empty string`
					);
				}
			});
			return true;
		}),

	body("thumbnailName")
		.isString()
		.withMessage("Thumbnail name must be a string")
		.notEmpty()
		.withMessage("Thumbnail name cannot be empty")
		.isLength({ min: 5, max: 200 })
		.withMessage("Thumbnail name must be between 5 and 200 characters")
		.matches(/^[^\\\/:*?"<>|]+(?:\.[a-zA-Z0-9]+)?$/),

	// Validation for the introduction section
	body("introduction.header")
		.isString()
		.withMessage("Introduction header must be a string")
		.notEmpty()
		.withMessage("Introduction header cannot be empty")
		.isLength({ min: 1, max: 100 })
		.withMessage("Introduction header must be between 1 and 100 characters"),

	body("introduction.content")
		.isString()
		.withMessage("Introduction content must be a string")
		.notEmpty()
		.withMessage("Introduction content cannot be empty")
		.isLength({ min: 1, max: 1000 })
		.withMessage("Introduction content must be between 1 and 1000 characters"),

	// Validation for content blocks
	body("content")
		.isArray()
		.withMessage("Content must be an array")
		.custom((content) => {
			content.forEach((block, index) => {
				// Check if block.type is a non-empty string
				if (typeof block.type !== "string" || !block.type.trim()) {
					throw new Error(
						`Block ${index}: type is required and must be a non-empty string`
					);
				}

				// Validation based on the block type
				switch (block.type) {
					case "text":
						if (typeof block.header !== "string" || !block.header.trim()) {
							throw new Error(
								`Block ${index}: header must be a non-empty string`
							);
						}
						if (block.header.length < 1 || block.header.length > 200) {
							throw new Error(
								`Block ${index}: header must be between 1 and 200 characters`
							);
						}
						if (
							typeof block.paragraph !== "string" ||
							!block.paragraph.trim()
						) {
							throw new Error(
								`Block ${index}: paragraph must be a non-empty string`
							);
						}
						if (block.paragraph.length < 1 || block.paragraph.length > 3000) {
							throw new Error(
								`Block ${index}: paragraph must be between 1 and 3000 characters`
							);
						}
						break;

					case "image":
						if (typeof block.src !== "string" || !block.src.trim()) {
							throw new Error(`Block ${index}: src must be a non-empty string`);
						}
						if (block.src.length < 1 || block.src.length > 300) {
							throw new Error(
								`Block ${index}: src must be between 1 and 300 characters`
							);
						}
						if (typeof block.alt !== "string" || !block.alt.trim()) {
							throw new Error(`Block ${index}: alt must be a non-empty string`);
						}
						if (block.alt.length < 1 || block.alt.length > 300) {
							throw new Error(
								`Block ${index}: alt must be between 1 and 300 characters`
							);
						}
						break;

					case "image-text":
						// Validation for the image field
						if (!block.image || typeof block.image !== "object") {
							throw new Error(
								`Block ${index}: image field is required and must be an object`
							);
						}
						if (
							typeof block.image.src !== "string" ||
							!block.image.src.trim()
						) {
							throw new Error(
								`Block ${index}: image.src must be a non-empty string`
							);
						}
						if (block.image.src.length < 1 || block.image.src.length > 300) {
							throw new Error(
								`Block ${index}: image.src must be between 1 and 300 characters`
							);
						}
						if (
							typeof block.image.alt !== "string" ||
							!block.image.alt.trim()
						) {
							throw new Error(
								`Block ${index}: image.alt must be a non-empty string`
							);
						}
						if (block.image.alt.length < 1 || block.image.alt.length > 300) {
							throw new Error(
								`Block ${index}: image.alt must be between 1 and 300 characters`
							);
						}
						// Validation for the text field as an array of objects
						if (!Array.isArray(block.text) || block.text.length === 0) {
							throw new Error(
								`Block ${index}: text field must be a non-empty array`
							);
						}
						block.text.forEach((textItem, textIndex) => {
							if (
								typeof textItem.header !== "string" ||
								!textItem.header.trim()
							) {
								throw new Error(
									`Block ${index}, text item ${textIndex}: header must be a non-empty string`
								);
							}
							if (textItem.header.length < 1 || textItem.header.length > 200) {
								throw new Error(
									`Block ${index}, text item ${textIndex}: header must be between 1 and 200 characters`
								);
							}
							if (
								typeof textItem.paragraph !== "string" ||
								!textItem.paragraph.trim()
							) {
								throw new Error(
									`Block ${index}, text item ${textIndex}: paragraph must be a non-empty string`
								);
							}
							if (
								textItem.paragraph.length < 1 ||
								textItem.paragraph.length > 3000
							) {
								throw new Error(
									`Block ${index}, text item ${textIndex}: paragraph must be between 1 and 3000 characters`
								);
							}
						});
						// Validation for the layout field
						if (
							typeof block.layout !== "string" ||
							!["left", "right"].includes(block.layout)
						) {
							throw new Error(
								`Block ${index}: layout must be either "left" or "right"`
							);
						}
						break;

					default:
						throw new Error(
							`Block ${index}: Unknown block type: ${block.type}`
						);
				}
			});
			return true;
		}),
];

module.exports = createPostValidator;
