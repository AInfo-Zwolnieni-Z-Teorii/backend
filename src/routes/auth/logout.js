require("dotenv").config();

const { Router } = require("express");
const RefreshToken = require("../../database/schemas/refreshToken");

const router = new Router();

router.post("/api/auth/logout", async (req, res) => {
	const refreshToken = req.cookies.refreshtoken;

	if (refreshToken != null) {
		try {
			await RefreshToken.deleteOne({ refreshToken: refreshToken });
		} catch (err) {
			console.log(err);
		}
	}

	res.clearCookie("accesstoken");
	res.clearCookie("refreshtoken");

	res.sendStatus(200);
});

module.exports = router;
