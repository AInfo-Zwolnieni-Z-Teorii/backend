const { Router } = require("express");

// Auth routers
const loginRouter = require("./auth/login");

// Posts routers
const getFullPost = require("./posts/getFullPost");
const getPostList = require("./posts/getPostList");
const getFeaturedPosts = require("./posts/getFeaturedPosts");

const createPost = require("./posts/createPost");

// Initialize main router
const mainRouter = new Router();

// Auth routers
mainRouter.use(loginRouter);

// Posts routers
mainRouter.use(getFullPost);
mainRouter.use(getPostList);
mainRouter.use(getFeaturedPosts);

mainRouter.use(createPost);

module.exports = mainRouter;
