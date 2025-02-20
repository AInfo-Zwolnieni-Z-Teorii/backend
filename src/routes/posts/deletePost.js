const { Router } = require("express");

const router = new Router();

router.delete("/api/posts/:id", (req, res) => {
	res.sendStatus(501);
});

module.exports = router;
