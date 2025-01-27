require("dotenv").config();
const express = require("express");

const dbConnect = require("./database/dbConnect");
const mainRouter = require("./routes/index");

const { createPost } = require("../tests/dbTests");

// Configs
const app = express();
dbConnect();

// Midlewares
app.use(express.json());

// Routers
app.use(mainRouter);

// Error handlers
app.use((req, res) => {
	res.status(404).send({ error: "Ta ścieżka nie istnieje" });
});

// Start listening
const PORT = process.env.EXPRESS_PORT || 3000;
// app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;
