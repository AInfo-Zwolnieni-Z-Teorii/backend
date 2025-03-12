const { Router } = require("express");
const { createUser, createCategory } = require("./dbTests");

const router = new Router();

// Creating user

router.post("/api/tests/create-user", async (req, res) => {
	const result = await createUser();

	if (result) res.status(201).send("User created");
	else res.sendStatus(500);
});

// Uploading files

// const path = require("path");
// const { v4: uuidv4 } = require("uuid");

// const postsStorage = multer.diskStorage({
// 	// Destination
// 	destination: function (req, file, cb) {
// 		cb(null, "./public/postsImages");
// 	},

// 	// Filename
// 	filename: function (req, file, cb) {
// 		const name = Date.now() + "-" + uuidv4() + path.extname(file.originalname);

// 		if (!req.uploadedFiles) {
// 			req.uploadedFiles = { thumbnail: [], image: [] };
// 		}

// 		req.uploadedFiles[file.fieldname].push(name);

// 		cb(null, name);
// 	},
// });

// router.post(
// 	"/api/tests/upload",
// 	multer({ storage: postsStorage }).fields([
// 		{ name: "thumbnail", maxCount: 1 },
// 		{ name: "image", maxCount: 20 },
// 	]),
// 	async (req, res) => {
// 		res.status(200).json(req.uploadedFiles);
// 	}
// );

require("dotenv").config();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { put } = require("@vercel/blob");
const path = require("path");

const blobStorage = multer.memoryStorage();
const upload = multer({ storage: blobStorage });

const fs = require("fs");

// Blob upload
router.post(
	"/api/tests/upload",
	upload.fields([{ name: "image", maxCount: 20 }]),
	async (req, res) => {
		// const file = req.file;
		// const fileName = uuidv4() + path.extname(file.originalname);

		console.log(req.files);
		res.status(200).json(req.files);
		// try {
		// 	const blob = await put(`postsImages/${fileName}`, file.buffer, {
		// 		access: "public",
		// 	});

		// 	console.log(blob);
		// 	res.status(201).json({ url: blob.url });
		// } catch (err) {
		// 	console.log(err);
		// 	res.status(500).json({ error: "Błąd podczas przesyłania pliku" });
		// }
	}
);

// getting url for images
router.get("/test-images", (req, res) => {
	const files = fs.readdirSync(postsImagesPath);
	res.json({
		path: postsImagesPath,
		files: files,
		exists: fs.existsSync(postsImagesPath),
	});
});

// Categories
router.post("/api/create-category", async (req, res) => {
	await createCategory();
	return res.sendStatus(201);
});

module.exports = router;

// Przesyłanie w req danych odnośnie lolalizacji plików na podstronie postu
// walidacja formularza z plikami oraz ich wielkości
// waidacja przesłanych danych odnośnie lokalizaci plików
