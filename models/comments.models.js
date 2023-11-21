const db = require("../db/connection");

exports.selectComments = (article_id) => {
  const queryValues = [];

  let baseQuery = "SELECT * FROM comments ";

  if (article_id) {
    queryValues.push(article_id);
    baseQuery += "WHERE article_id = $1 ";
  }

  baseQuery += "ORDER BY created_at DESC";

  return db.query(baseQuery + ";", queryValues).then(({ rows }) => {
    return rows;
  });
};
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

exports.deleteComment = (comment_id) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [comment_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
  });
};