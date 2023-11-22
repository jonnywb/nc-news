const commentsRouter = require("express").Router();
const { removeComment } = require("../controllers/comments.controllers");

commentsRouter.delete("/:comment_id", removeComment);

module.exports = commentsRouter;
