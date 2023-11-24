const {
  selectArticles,
  selectArticleById,
  updateArticleById,
  insertArticle,
  deleteArticle,
  selectTotalCount,
} = require("../models/articles.models");
const { checkExists } = require("../utils/utils");

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;

  const promises = [selectTotalCount(topic)];

  if (topic) {
    promises.push(checkExists("topics", "slug", topic));
  }

  Promise.all(promises)
    .then((promises) => {
      return selectArticles(req.query, promises[0]);
    })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  const promiseArticles = [updateArticleById(article_id, inc_votes)];

  if (article_id) {
    promiseArticles.push(selectArticleById(article_id));
  }

  Promise.all(promiseArticles)
    .then((promiseResults) => {
      res.status(200).send({ article: promiseResults[0] });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  insertArticle(req.body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.removeArticle = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticle(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
