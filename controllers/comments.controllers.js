const { selectComByArtId } = require("../models/comments.models");

exports.getComByArtId = (req, res, next) => {
  const { article_id } = req.params;
  selectComByArtId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
