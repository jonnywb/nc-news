const db = require("../db/connection");

exports.selectArticles = (topic, sort_by, order) => {
  // SELECT FROM JOIN ON
  let baseQuery =
    "SELECT articles.article_id, title, topic, articles.author, articles.created_at, article_img_url, articles.votes, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id ";

  // WHERE
  const dbQueries = [];
  if (topic) {
    dbQueries.push(topic);
    baseQuery += "WHERE topic = $1 ";
  }

  // GROUP BY
  baseQuery += "GROUP BY articles.article_id ";

  //ORDER BY (sort_by)
  sort_by = sort_by || "created_at";
  const validSortBy = ["article_id", "title", "topic", "author", "created_at", "votes"];

  if (validSortBy.includes(sort_by)) {
    baseQuery += `ORDER BY articles.${sort_by} `;
  } else if (sort_by === "comment_count") {
    baseQuery += "ORDER BY comment_count ";
  } else {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  // ASC / DESC (ORDER)
  order = order || "desc";
  if (order === "asc") {
    baseQuery += "ASC;";
  } else if (order === "desc") {
    baseQuery += "DESC;";
  } else {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return db.query(baseQuery, dbQueries).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `
  SELECT articles.*, COUNT(comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;`,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
