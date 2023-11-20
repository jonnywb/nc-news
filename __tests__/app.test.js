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

  test("should return 200 status code", () => {
    return request(app).get("/api").expect(200);
  });

  test("should return an object on body.endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.endpoints).toBe("object");
      });
  });

  test("should return an object for currently available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        endpoints.forEach((endpoint) => {
          expect(typeof body.endpoints[endpoint]).toBe("object");
        });
      });
  });

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
