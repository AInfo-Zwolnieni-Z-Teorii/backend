/**
 * Transforms a database post object into a simplified format.
 *
 * @param {Object} dbPost - The database post object with various properties.
 * @returns {Object} A new object containing selected and transformed properties:
 *   - title: The title of the post.
 *   - slug: The URL-friendly version of the post title.
 *   - authorName: The username of the author.
 *   - thumbnailName: The name of the thumbnail image.
 *   - ytIframe: The YouTube iframe link.
 *   - content: The content of the post.
 *   - creationDate: The date when the post was created.
 *   - categories: An array of category objects with name and slug properties.
 */

function transformPost(dbPost) {
	return {
		title: dbPost.title,
		slug: dbPost.slug,
		authorName: dbPost.author.username,
		thumbnailName: dbPost.thumbnailName,
		ytIframe: dbPost.ytIframe,
		content: dbPost.content,
		creationDate: dbPost.createdAt,
		categories: dbPost.category.map((category) => ({
			name: category.name,
			slug: category.slug,
		})),
	};
}

module.exports = { transformPost };
