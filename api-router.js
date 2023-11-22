const apiRouter = require("express").Router();

const { getApi } = require("./controllers/api.controllers");

const articlesRouter = require("./routes/articles.routes");
const usersRouter = require("./routes/users.routes");
const commentsRouter = require("./routes/comments.routes");
const topicsRouter = require("./routes/topics.routes");

apiRouter.get("/", getApi);

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
