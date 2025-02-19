const { Router } = require("express");
const { authMiddleware, isAdminMiddleware } = require("../../utils/jwt");
const { validationResult, matchedData } = require("express-validator");
const createPostValidator = require("../../utils/validationSchemas/createPost");

const router = new Router();

router.post(
	"/api/posts",
	authMiddleware,
	isAdminMiddleware,
	createPostValidator,
	async (req, res) => {
		// Validation
		const result = validationResult(req);
		if (!result.isEmpty())
			return res.status(400).send({ errors: result.array() });

		const data = matchedData(req);

		res.sendStatus(201);
	}
);

module.exports = router;
