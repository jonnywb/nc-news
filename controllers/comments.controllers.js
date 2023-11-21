const { selectComments, insertComment } = require("../models/comments.models");
const { selectArticleById } = require("../models/articles.models");

exports.getComByArtId = (req, res, next) => {
  const { article_id } = req.params;

  const articlePromises = [selectComments(article_id)];

  if (article_id) {
    articlePromises.push(selectArticleById(article_id));
  }

  Promise.all(articlePromises)
    .then((resolvedPromises) => {
      res.status(200).send({ comments: resolvedPromises[0] });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  insertComment(article_id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
