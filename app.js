const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers");
const { getArticles } = require("./controllers/articles.controllers");
const { handle404, handleServerError } = require("./error");
const { getApi } = require("./controllers/api.controllers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.all("*", handle404);

app.use(handleServerError);

module.exports = app;
