const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers");
const { handle404, handleServerError } = require("./error");

app.get("/api/topics", getTopics);

app.all("*", handle404);

app.use(handleServerError);

module.exports = app;
