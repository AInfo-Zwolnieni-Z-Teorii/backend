const { Router } = require("express");

// Auth routers
const loginRouter = require("./auth/login");
const refreshRouter = require("./auth/refresh");
const logoutRouter = require("./auth/logout");

// Posts routers
const getFullPost = require("./posts/getFullPost");
const getPostList = require("./posts/getPostList");
const getFeaturedPosts = require("./posts/getFeaturedPosts");

const createPost = require("./posts/createPost");
const updatePost = require("./posts/updatePost");
const deletePost = require("./posts/deletePost");

// Initialize main router
const mainRouter = new Router();

// Auth routers
mainRouter.use(loginRouter);
mainRouter.use(refreshRouter);
mainRouter.use(logoutRouter);

// Posts routers
mainRouter.use(getFullPost);
mainRouter.use(getPostList);
mainRouter.use(getFeaturedPosts);

mainRouter.use(createPost);
mainRouter.use(updatePost);
mainRouter.use(deletePost);

module.exports = mainRouter;
