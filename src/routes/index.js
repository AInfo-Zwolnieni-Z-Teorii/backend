const { Router } = require("express");

// Posts routers
const getFullPost = require("./posts/getFullPost");
const getPostList = require("./posts/getPostList");
const getFeaturedPosts = require("./posts/getFeaturedPosts");

// Initialize main router
const mainRouter = new Router();

// Posts routers
mainRouter.use(getFullPost);
mainRouter.use(getPostList);
mainRouter.use(getFeaturedPosts);

module.exports = mainRouter;
