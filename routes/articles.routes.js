const articlesRouter = require("express").Router();

const { getArticles, getArticleById, patchArticleById } = require("../controllers/articles.controllers");

const { postComment, getComByArtId } = require("../controllers/comments.controllers");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleById);
articlesRouter.get("/:article_id/comments", getComByArtId);
articlesRouter.post("/:article_id/comments", postComment);

module.exports = articlesRouter;
