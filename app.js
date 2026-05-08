const express = require("express");
const app = express();
const cors = require("cors");

const apiRouter = require("./routes/api-router");

const { handle404, handleCustomError, handlePsqlError, handleServerError } = require("./controllers/error");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", handle404);

app.use(handlePsqlError);
app.use(handleCustomError);
app.use(handleServerError);

module.exports = app;
