const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const { getEndpoints } = require("../utils/utils");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET /api/topics", () => {
  test("should first return a status of 200 and return an array on topics key", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
      });
  });

  test("should return array with correct length property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
      });
  });

  test("should return array of objects with the correct keys", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("should return status 200 and body.articles should be an array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
      });
  });

  test("should return array with length of 10", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
      });
  });

  test("all items in array should be objects with the correct article properties -> (no body property)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
          expect(article.body).toBe(undefined);
        });
      });
  });

  test("comment_count should return correct number of comments for given article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].comment_count).toBe("2");
      });
  });

  test("items should be sorted by 'created_at' in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("should return status code 200 and a single object on body.article with correct key/values", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("should return 404 if article with id not present", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("should return 400 if invalid article_id", () => {
    return request(app)
      .get("/api/articles/HelloThere")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("should return status 200 and body.comments should be an array", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
      });
  });

  test("should array of length 11 for article 1", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(10);
      });
  });

  test("should return array of comment objects with correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });

  test("comments should be served with most recent comment first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("should return empty array if article exists, but no comments on article", () => {
    return request(app)
      .get("/api/articles/13/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });

  test("should return 404 if article_id not found", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("should return 400 if article_id invalid", () => {
    return request(app)
      .get("/api/articles/GeneralKenobi/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("should return 200 and array object", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
      });
  });

  test("should return array with correct length", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
      });
  });

  test("should return array of user objects with correct properties/values", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET *", () => {
  test("should return 404 error 'not found' if incorrect path", () => {
    return request(app)
      .get("/api/tropics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api", () => {
  const endpoints = getEndpoints(app);

  test("each available endpoint should have object with desc., queries, exampleResponse and exampleRequest(if needed)", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        endpoints.forEach((endpoint) => {
          const endpointObj = body.endpoints[endpoint];
          expect(endpointObj).not.toBe(undefined);
        });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("should return status code 200 and respond with updated article object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 3 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 103,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("should return 400 Bad Request if bad article_id", () => {
    return request(app)
      .patch("/api/articles/uwotm8")
      .send({ inc_votes: 3 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("should return 404 not found if article_id doesn't exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 3 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("should return 400 Bad Request if invalid request body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "I'm not wearing hockey pads" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("should return 201 and object with correct properties", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "test" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 19,
          author: "butter_bridge",
          body: "test",
        });
      });
  });

  test("should return 404 Not Found if article not found", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({ username: "butter_bridge", body: "test" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("should return 400 Bad Request if invalid article_id", () => {
    return request(app)
      .post("/api/articles/obi/comments")
      .send({ username: "butter_bridge", body: "test" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("should return 404 Not Found if username not valid", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: 1,
        body: "test",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("should return 400 Bad Request if request object has missing properties", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "test",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("should return 204 with no content", () => {
    return request(app).delete("/api/comments/18").expect(204);
  });

  test("should return 404 if comment_id doesn't exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("should return 400 bad request if bad comment_id", () => {
    return request(app)
      .delete("/api/comments/tomato")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles >>> TOPIC", () => {
  test("should return status 200 and array of articles with correct length", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
      });
  });

  test("should return an array of objects with correct properties", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });

  test("should return status 404 and msg: not found if topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=music")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("should return an empty array if topic exists but no articles are associated", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
});

describe("GET /api/articles/:article_id >>> COMMENT COUNT", () => {
  test("should return status 200 and an article with comment_count property of correct length", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comment_count).toBe("11");
      });
  });
});

describe("GET /api/articles >>> SORT", () => {
  test("should be able to sort by... title", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
      });
  });

  test("should be able to sort by... topic, descending", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=desc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("topic", { descending: true });
      });
  });

  test("should be able to sort by... author, ascending", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { descending: false });
      });
  });

  test("should be able to sort by... comment_count, ascending", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("comment_count", { descending: false, coerce: true });
      });
  });

  test("should return error 400 Bad Request, if sort_by is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=drinksOrdered")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("should return error 400 Bad Request, if order is invalid", () => {
    return request(app)
      .get("/api/articles?order=Jaegerbombs")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("should return status code 200 and a single object on body.user with correct key/values", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });

  test("should return 404 if username not present", () => {
    return request(app)
      .get("/api/users/bobby_b")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("should return status code 200 and respond with updated article object", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 3 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 19,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
        });
      });
  });

  test("should return 400 Bad Request if bad comment_id", () => {
    return request(app)
      .patch("/api/comments/uwotm8")
      .send({ inc_votes: 3 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("should return 404 not found if comment_id doesn't exist", () => {
    return request(app)
      .patch("/api/comments/9999")
      .send({ inc_votes: 3 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("should return 400 Bad Request if invalid request body", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "don't tell me what to do" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles", () => {
  test("should return 201 and created object with correct properties", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "Dogs are way better",
        body: "Let's just accept it, people.",
        topic: "cats",
        article_img_url: "http://images.some.url/path",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 14,
          votes: 0,
          created_at: expect.any(String),
          comment_count: "0",
        });
      });
  });

  test("should return 404 if username 'Not Found'", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "tim",
        title: "Dogs are way better",
        body: "Let's just accept it, people.",
        topic: "cats",
        article_img_url: "http://images.some.url/path",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("should return 404 if topic 'Not Found'", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "Dogs are way better",
        body: "Let's just accept it, people.",
        topic: "feline",
        article_img_url: "http://images.some.url/path",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("should return 400 if invalid request object", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        body: "Let's just accept it, people.",
        topic: "feline",
        article_img_url: "http://images.some.url/path",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles >>> LIMIT, PAGE", () => {
  test("should return 10 articles (by default) on page 1, all with total_count property", () => {
    return request(app)
      .get("/api/articles?p=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.total_count).toBe(13);
        expect(body.articles.length).toBe(10);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });

  test("should return 3 articles on page 2 with limit set to 5", () => {
    return request(app)
      .get("/api/articles?limit=5&p=3")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(3);
      });
  });

  test("should return article_id 4 on page two if limit set to 3", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc&limit=3&p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).toBe(4);
      });
  });

  test("should return 3 articles on page 4 with limit set to 3 WITH correct total_count (12)", () => {
    return request(app)
      .get("/api/articles?topic=mitch&limit=3&page=4")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(3);
        expect(body.total_count).toBe(12);
      });
  });

  test("should return 400 Bad Request if limit is not a number", () => {
    return request(app)
      .get("/api/articles?limit=POTATO&p=3")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("should return 400 Bad Request if p is not a number", () => {
    return request(app)
      .get("/api/articles?p=boilEmMashEm")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("should return 400 Bad Request if limit is above 10", () => {
    return request(app)
      .get("/api/articles?limit=30")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles/:article_id/comments >>> LIMIT, PAGE", () => {
  test("should return 10 comments (by default) on page 1", () => {
    return request(app)
      .get("/api/articles/1/comments?p=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(10);
      });
  });

  test("should return 3 articles on page 2 with limit set to 8", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=8&p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(3);
      });
  });

  test("should return 400 Bad Request if limit is not a number", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=POTATO&p=3")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("should return 400 Bad Request if p is not a number", () => {
    return request(app)
      .get("/api/articles/1/comments?p=boilEmMashEm")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("should return 400 Bad Request if limit is above 10", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=30")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/topics", () => {
  test("should return status 201 and newly created topic obj", () => {
    return request(app)
      .post("/api/topics")
      .send({ slug: "films", description: "a place to discuss any feature length film" })
      .expect(201)
      .then(({ body }) => {
        expect(body.topic).toMatchObject({
          slug: "films",
          description: "a place to discuss any feature length film",
        });
      });
  });

  test("should return status 400 if duplicate topic", () => {
    return request(app)
      .post("/api/topics")
      .send({ slug: "mitch", description: "a place to discuss any feature length film" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("should return status 400 if invalid request object", () => {
    return request(app)
      .post("/api/topics")
      .send({ description: "description" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/articles/:article", () => {
  test("should return 204 with no content", () => {
    return request(app).delete("/api/articles/13").expect(204);
  });

  test("should return 404 if article_id doesn't exist", () => {
    return request(app)
      .delete("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("should return 400 bad request if bad article_id", () => {
    return request(app)
      .delete("/api/comments/tomato")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles >> MAX PAGE COUNT", () => {
  test("should not allow to move past max number of pages, return 400 Bad Request", () => {
    return request(app)
      .get("/api/articles?limit=10&p=3")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
