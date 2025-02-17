const { Router } = require("express");
const { authMiddleware } = require("../../utils/jwt");

const router = new Router();

router.post("/api/posts", authMiddleware, async (req, res) => {
	res.sendStatus(201);
});

module.exports = router;
