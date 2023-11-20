const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query(
      "SELECT article_id, title, topic, author, created_at, article_img_url FROM articles ORDER BY created_at DESC;"
    )
    .then(({ rows }) => {
      return rows;
    });
};
