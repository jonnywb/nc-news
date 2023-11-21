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
