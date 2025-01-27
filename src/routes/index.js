const { Router } = require("express");
const getFullPost = require("./posts/getFullPost");

// Initialize main router
const mainRouter = new Router();

// Using other routers
mainRouter.use(getFullPost);

module.exports = mainRouter;
