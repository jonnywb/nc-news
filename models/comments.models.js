const db = require("../db/connection");

exports.insertComment = (article_id, newComment) => {
  return db
    .query(`INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`, [
      newComment.body,
      newComment.username,
      article_id,
    ])
    .then(({ rows }) => {
      return rows[0];
    });
};
