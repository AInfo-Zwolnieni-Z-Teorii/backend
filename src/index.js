require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

const dbConnect = require("./database/dbConnect");
const mainRouter = require("./routes/index");

// Configs
const app = express();

// CORS
app.use(
	cors({
		origin: [
			"https://www.ainfo.blog",
			"http://localhost:3000",
			"http://localhost:5173",
			"http://127.0.0.1:3000",
			"http://127.0.0.1:5174",
		],
		credentials: true,
	})
);

// // exporting static files - posts images
// const postsImagesPath = path.join(__dirname, "../public/postsImages");
// console.log("Posts images path:", postsImagesPath);

// // Check if folder exists
// if (!fs.existsSync(postsImagesPath)) {
// 	console.log("UWAGA: Folder postsImages nie istnieje!");
// }

// app.use("/postsImages", express.static(postsImagesPath));

// Midlewares and configs
app.use(express.json());
app.use(cookieParser());
app.use("/api", dbConnect); // connecting to db as a midleware (for api routes)

// Routers
app.use(mainRouter);

// Tests
app.use(require("../tests/testRouter"));

// Error handlers
app.use((req, res) => {
	res.status(404).send({ error: "Ta ścieżka nie istnieje" });
});

// ENV tests
console.log(`Current env: ${process.env.NODE_ENV}`);

// Start listening
const PORT = process.env.EXPRESS_PORT || 3000;
if (process.env.NODE_ENV === "development")
	app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;
