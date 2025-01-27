const categoryModel = require("../src/database/schemas/category");
const postModel = require("../src/database/schemas/post");
const userModel = require("../src/database/schemas/user");

// Basic tests for post, user and category schemas
const createUser = async () => {
	console.log("Creating user");

	// For tests purposes
	const newUser = new userModel({
		username: "Michał z Ainfo",
		email: "michal.kowalski@ainfo.pl",
		password: "qwerty123",
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
		name: "AI od zera",
		slug: "ai-od-zera",
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
		title: "Wpływ AI na sztukę i kreatywność",
		slug: "wplyw-ai-na-sztuke-i-kreatywnosc",
		author: "67975fe8e4a214e75d46ebc7",
		category: ["67975f5305ed19129568fb4e", "67975f6c9b8147a1077cb653"],
		thumbnailName: "testThumbnail.jpg",
		content:
			"<p>Sztuczna inteligencja zaczyna odgrywać znaczącą rolę w sztuce, muzyce i literaturze. Narzędzia AI potrafią tworzyć obrazy, komponować muzykę i pisać teksty, przekraczając granice ludzkiej kreatywności.</p><p>Choć AI oferuje niesamowite możliwości, rodzi pytania o autentyczność i własność intelektualną. <em>Czy AI może być artystą?</em></p>",
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

module.exports = { createCategory, createPost, createUser };
