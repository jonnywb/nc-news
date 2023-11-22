const express = require("express");
const app = express();

const apiRouter = require("./api-router");

const { handle404, handleCustomError, handlePsqlError, handleServerError } = require("./error");

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", handle404);

app.use(handlePsqlError);
app.use(handleCustomError);
app.use(handleServerError);

module.exports = app;
