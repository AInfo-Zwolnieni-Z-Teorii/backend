const { Router } = require("express");

// Posts routers
const getFullPost = require("./posts/getFullPost");
const getPostList = require("./posts/getPostList");

// Initialize main router
const mainRouter = new Router();

// Posts routers
mainRouter.use(getFullPost);
mainRouter.use(getPostList);

module.exports = mainRouter;
