const { Router } = require("express");
const { createUser } = require("./dbTests");

const router = new Router();

router.post("/api/tests/create-user", async (req, res) => {
    const result = await createUser();

    if (result) res.status(201).send("User created");
    else res.sendStatus(500);
});

module.exports = router;