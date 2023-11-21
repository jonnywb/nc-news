const { selectComments, deleteComment } = require("../models/comments.models");
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

exports.removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
