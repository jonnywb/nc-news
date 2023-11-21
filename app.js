const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers");

const { getArticles, getArticleById, patchArticleById } = require("./controllers/articles.controllers");

const { postComment, getComByArtId } = require("./controllers/comments.controllers");

const { handle404, handleCustomError, handlePsqlError, handleServerError } = require("./error");

const { getApi } = require("./controllers/api.controllers");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getComByArtId);
app.post("/api/articles/:article_id/comments", postComment);

app.all("*", handle404);

app.use(handlePsqlError);
app.use(handleCustomError);
app.use(handleServerError);

module.exports = app;
