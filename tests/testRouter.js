const { Router } = require("express");
const { createUser } = require("./dbTests");

const router = new Router();

// Creating user

router.post("/api/tests/create-user", async (req, res) => {
	const result = await createUser();

	if (result) res.status(201).send("User created");
	else res.sendStatus(500);
});

// Uploading files

const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const postsStorage = multer.diskStorage({
	// Destination
	destination: function (req, file, cb) {
		cb(null, "./public/postsImages");
	},

	// Filename
	filename: function (req, file, cb) {
		const name = Date.now() + "-" + uuidv4() + path.extname(file.originalname);

		if (!req.uploadedFiles) {
			req.uploadedFiles = { thumbnail: [], image: [] };
		}

		req.uploadedFiles[file.fieldname].push(name);

		cb(null, name);
	},
});

router.post(
	"/api/tests/upload",
	multer({ storage: postsStorage }).fields([
		{ name: "thumbnail", maxCount: 1 },
		{ name: "image", maxCount: 20 },
	]),
	async (req, res) => {
		res.status(200).json(req.uploadedFiles);
	}
);

module.exports = router;

// Przesyłanie w req danych odnośnie lolalizacji plików na podstronie postu
// walidacja formularza z plikami oraz ich wielkości
// waidacja przesłanych danych odnośnie lokalizaci plików
