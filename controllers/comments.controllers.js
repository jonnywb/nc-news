const { selectComments, insertComment, deleteComment, updateComment } = require("../models/comments.models");
const { selectArticleById } = require("../models/articles.models");
const { checkExists } = require("../utils/utils");

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

exports.removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  const commentPromises = [updateComment(comment_id, inc_votes)];

  if (comment_id) {
    commentPromises.push(checkExists("comments", "comment_id", comment_id));
  }

  Promise.all(commentPromises)
    .then((returnedPromises) => {
      res.status(200).send({ comment: returnedPromises[0] });
    })
    .catch(next);
};
