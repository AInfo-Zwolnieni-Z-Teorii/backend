require("dotenv").config();
const express = require("express");

const dbConnect = require("./database/dbConnect");

// Configs
const app = express();
dbConnect();

// Midlewares
app.use(express.json());

// Routes
app.get("/api/test", (req, res) => {
	return res.status(200).send({ msg: "Test approved" });
});

// Start listening
const PORT = process.env.EXPRESS_PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
