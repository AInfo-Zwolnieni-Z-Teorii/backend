function transformPost(dbPost, shortPost = false) {
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

	if (shortPost) return newPost;

	newPost.authorName = dbPost.author.username;
	newPost.ytIframeLink = dbPost.ytIframeLink;

	newPost.content = dbPost.content;

	return newPost;
}

module.exports = { transformPost };
