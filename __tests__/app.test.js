const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

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

  test("should return array with length of 13", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
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
          created_at: "2020-07-09T20:11:00.000Z",
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
        expect(body.comments.length).toBe(11);
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
  const endpoints = app._router.stack
    .filter((r) => r.route)
    .map((r) => {
      const route = r.route;
      const methods = [];
      if (route.path !== "*") {
        for (let value of route.stack) {
          methods.push(`${value.method.toUpperCase()} ${route.path}`);
        }
      }
      return methods;
    })
    .flat();

  test("each available endpoint should have object with desc., queries, exampleResponse and exampleRequest(if needed)", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        endpoints.forEach((endpoint) => {
          const endpointObj = body.endpoints[endpoint];
          if (endpoint === "GET /api") {
            expect(typeof endpointObj.description).toBe("string");
          } else if (endpoint.includes("GET") || endpoint.includes("DELETE")) {
            expect(typeof endpointObj.description).toBe("string");
            expect(Array.isArray(endpointObj.queries)).toBe(true);
            expect(typeof endpointObj.exampleResponse).toBe("object");
          } else {
            expect(typeof endpointObj.description).toBe("string");
            expect(Array.isArray(endpointObj.queries)).toBe(true);
            expect(typeof endpointObj.exampleResponse).toBe("object");
            expect(typeof endpointObj.exampleRequest).toBe("object");
          }
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
          created_at: "2020-07-09T20:11:00.000Z",
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
    return request(app)
      .delete("/api/comments/18")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  test("should return 404 if comment_id doesn't exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("should return 400 bad request if bad commend_id", () => {
    return request(app)
      .delete("/api/comments/tomato")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});