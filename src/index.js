require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const dbConnect = require("./database/dbConnect");
const mainRouter = require("./routes/index");

// Configs
const app = express();

// Midlewares
// const allowedOrigins = [
// 	"https://ainfo.blog",
// 	"https://localhost:3000",
// 	"https://localhost:5173",
// ];

// app.use(
// 	cors({
// 		origin: (origin, callback) => {
// 			if (!origin || allowedOrigins.includes(origin)) {
// 				callback(null, origin);
// 			} else {
// 				callback(new Error("Not allowed by CORS"));
// 			}
// 		},
// 		credentials: true,
// 	})
// );
app.use(express.json());
app.use(cookieParser());
app.use(dbConnect); // connecting to db as a midleware

// Routers
app.use(mainRouter);

// Tests
// app.use(require("../tests/testRouter"));

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
