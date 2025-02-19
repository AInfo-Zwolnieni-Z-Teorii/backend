const { Router } = require("express");
const { authMiddleware, isAdminMiddleware } = require("../../utils/jwt");

const router = new Router();

router.post(
	"/api/posts",
	authMiddleware,
	isAdminMiddleware,
	async (req, res) => {
		res.sendStatus(201);
	}
);

module.exports = router;
