const db = require("../db/connection");

exports.selectArticles = (query) => {
  let { topic, sort_by, order, p, limit } = query;
  // SELECT FROM JOIN ON
  let baseQuery =
    "SELECT articles.article_id, title, topic, articles.author, articles.created_at, article_img_url, articles.votes, COUNT(comment_id) AS comment_count, subquery.total_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id LEFT JOIN (SELECT COUNT(*) AS total_count FROM articles ";

  const dbQueries = [];
  //SUBQUERY WHERE
  if (topic) {
    dbQueries.push(topic);
    baseQuery += `WHERE topic = $${dbQueries.length} `;
  }

  baseQuery += ") AS subquery ON true ";

  // WHERE
  if (topic) {
    baseQuery += "WHERE topic = $1 ";
  }

  // GROUP BY
  baseQuery += "GROUP BY articles.article_id, subquery.total_count ";

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
    baseQuery += "ASC ";
  } else if (order === "desc") {
    baseQuery += "DESC ";
  } else {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

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

exports.insertArticle = (newArticle) => {
  const { author, title, body, topic, image } = newArticle;
  return db
    .query(
      `WITH insert_article AS (
        INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *
      )
      SELECT insert_article.article_id, insert_article.votes, insert_article.created_at, COUNT(comment_id) AS comment_count 
      FROM insert_article
      LEFT JOIN comments on comments.article_id = insert_article.article_id
      GROUP BY insert_article.article_id, insert_article.votes, insert_article.created_at;`,
      [title, topic, author, body, image]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteArticle = (article_id) => {
  return db.query("DELETE FROM articles WHERE article_id = $1 RETURNING *;", [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
  });
};
