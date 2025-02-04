require("dotenv").config();
const express = require("express");
const cors = require('cors');

const dbConnect = require("./database/dbConnect");
const mainRouter = require("./routes/index");

// Configs
const app = express();

// Midlewares
app.use(cors());
app.use(express.json());
app.use(dbConnect); // connecting to db as a midleware

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
