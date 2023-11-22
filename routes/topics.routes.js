const topicsRouter = require("express").Router();

const { getTopics } = require("../controllers/topics.controllers");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
