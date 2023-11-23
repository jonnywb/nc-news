const apiRouter = require("express").Router();

const { getApi } = require("../controllers/api.controllers");

const articlesRouter = require("./articles.routes");
const usersRouter = require("./users.routes");
const commentsRouter = require("./comments.routes");
const topicsRouter = require("./topics.routes");

apiRouter.get("/", getApi);

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
