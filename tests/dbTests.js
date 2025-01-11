// Basic tests for post, user and category schemas
const createUser = async () => {
	console.log("Creating user");

	// For tests purposes
	const newUser = new userModel({
		username: "użytkownikTestowy",
		email: "uzytkownik.testowy@ainfo.pl",
		password: "hasłoTestowe",
		isAdmin: true,
	});

	try {
		var savedUser = await newUser.save();
		console.log("Nowy użytkownik: ", savedUser);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

const createCategory = async () => {
	console.log("Creating category");

	const newCategory = new categoryModel({
		name: "KategoriaTestowa",
		slug: "kategoria-testowa",
	});

	try {
		const savedCategory = await newCategory.save();
		console.log("Nowa kategoria: ", savedCategory);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

const createPost = async () => {
	console.log("Creating post");

	const newPost = new postModel({
		title: "Post Testowy",
		slug: "post-testowy",
		author: "6782ee2d461e2f99fe093e83",
		category: "6782ee2d461e2f99fe093e82",
		thumbnailName: "testThumbnail.jpg",
		content:
			"<p><strong>Lorem Impsum</strong>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu leo quis tellus semper vehicula. Suspendisse at mattis enim. Vestibulum sit amet nisl lectus. Duis molestie feugiat mi.Mauris malesuada neque est, a mollis risus semper quis. Nullam vel risus ut quam posuere rhoncus.</p><p>Cras eleifend volutpat elit id hendrerit. Sed ullamcorper bibendum leo sed sagittis. Maecenas scelerisque diam elit, sit amet porta nunc consequat ut. Nam vulputate nulla vel rhoncus sodales. Nam in turpis vitae dui dapibus commodo vel ut risus. Donec sed leo mattis, <em>suscipit justo ut</em>, imperdiet sapien.</p>",
	});

	try {
		const savedPost = await newPost.save();
		console.log("Nowy post: ", savedPost);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

const main = async () => {
	const post = await postModel.findOne().populate("author");
	console.log(post.author.username);
};
