/**
 * Transforms a post from database format to API format.
 * @param {object} dbPost - Post in database format.
 * @param {boolean} shortPost - If true, returns a short version of the post (list post).
 * @returns {object} Transformed post in API format.
 */
const transformPost = (dbPost, shortPost = false) => {
	if (shortPost) {
		// Short post (list post)
		const newPost = {
			title: dbPost.title,
			slug: dbPost.slug,
			thumbnailName: dbPost.thumbnailName,
			creationDate: dbPost.createdAt,
			categories: dbPost.category.map((category) => ({
				name: category.name,
				slug: category.slug,
			})),
		};

		return newPost;
	}

	// Full post
	const newPost = {
		title: dbPost.title,
		slug: dbPost.slug,
		author: dbPost.author.username,
		authorAvatar: dbPost.author.avatar,
		categories: dbPost.category.map((category) => ({
			name: category.name,
			slug: category.slug,
		})),
		thumbnailName: dbPost.thumbnailName,
		introduction: {
			header: dbPost.introduction.header,
			content: dbPost.introduction.content,
		},
		tableOfContents: [
			dbPost.tableOfContents.content.map((entry) => {
				return {
					header: entry.header,
					anchor: entry.anchor,
				};
			}),
		],
		content: [
			dbPost.contentBlocks.map((block) => {
				if (block.type === "text") {
					return {
						type: "text",
						header: block.data.header,
						paragraph: block.data.paragraph,
						anchor: block.data.anchor,
					};
				} else if (block.type === "image") {
					return {
						type: "image",
						src: block.data.src,
						alt: block.data.alt,
					};
				} else if (block.type === "image-text") {
					return {
						type: "image-text",
						image: {
							src: block.data.image.src,
							alt: block.data.image.alt,
						},
						text: block.data.text.map((section) => ({
							header: section.header,
							paragraph: section.paragraph,
							anchor: section.anchor,
						})),
						layout: block.data.layout,
					};
				}
			}),
		],
		creationDate: dbPost.createdAt,
	};

	return newPost;
};

module.exports = { transformPost };
