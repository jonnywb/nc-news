const db = require("../db/connection");

exports.selectComments = (article_id, limit, p) => {
  const queryValues = [];

  let baseQuery = "SELECT * FROM comments ";

  // WHERE -> filter by article
  if (article_id) {
    queryValues.push(article_id);
    baseQuery += "WHERE article_id = $1 ";
  }

  // ORDER BY
  baseQuery += "ORDER BY created_at DESC ";

  // LIMIT
  limit = limit || 10;
  if (!Number(limit) || limit > 10) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  // OFFSET
  p = p || 1;
  if (!Number(p)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  let offset = limit * (p - 1);

  baseQuery += `LIMIT ${limit} OFFSET ${offset};`;

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

exports.updateComment = (comment_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE comments
    SET votes = votes + $2
    WHERE comment_id = $1
    RETURNING *;`,
      [comment_id, inc_votes]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
