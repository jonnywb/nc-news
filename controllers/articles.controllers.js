const { selectArticles, selectArticleById, updateArticleById } = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
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
