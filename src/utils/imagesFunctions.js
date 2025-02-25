const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { del } = require("@vercel/blob");

/**
 * Generates a unique filename based on the original file name.
 *
 * @param {string} originalName - The original name of the file.
 * @returns {string} - The generated unique file name.
 */
const generateFileName = (originalName) => {
	const uuid = uuidv4();
	const currentDate = Date.now();
	const filename = `${currentDate}-${uuid}${path.extname(originalName)}`;

	return filename;
};

/**
 * Deletes the uploaded files from the blob storage.
 *
 * @param {Object} uploadedFiles - The object containing the uploaded files.
 * @param {string} uploadedFiles.thumbnail - The URL of the uploaded thumbnail.
 * @param {Array<string>} uploadedFiles.images - The URLs of the uploaded images.
 */
const deleteBlob = async (uploadedFiles) => {
	const thumbnail = uploadedFiles.thumbnail;
	const images = uploadedFiles.images;

	await del(thumbnail);
	for (const image of images) {
		await del(image);
	}
};

module.exports = { generateFileName, deleteBlob };
