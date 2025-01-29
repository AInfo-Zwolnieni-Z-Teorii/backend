/**
 * Generates a table of contents based on the given content blocks.
 *
 * @param {Array} blocks - The content blocks to generate the table of contents from.
 *
 * @returns {Array} The table of contents. Each element is an object with the keys 'header' (the header text) and 'anchor' (the anchor for this header).
 */
const generateTableOfContents = (blocks) => {
	const toc = [];

	blocks.forEach((block) => {
		if (block.type === "text") {
			// For text blocks
			toc.push({ header: block.data.header, anchor: block.data.anchor });
		} else if (block.type === "image-text") {
			// For image-text blocks
			block.data.text.forEach((text) => {
				toc.push({ header: text.header, anchor: text.anchor });
			});
		}
	});

	return toc;
};

module.exports = generateTableOfContents;
