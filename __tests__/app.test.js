const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

const data = require("../db/data/test-data/index");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("nc-games app", () => {
  describe("GET /api/categories", () => {
    it("200 OK: returns an array of category objects under the key of 'categories'", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: { categories } }) => {
          expect(categories).toHaveLength(4);
          categories.forEach((category) => {
            expect(category).toHaveProperty("slug");
            expect(category).toHaveProperty("description");
          });
        });
    });
  });
  describe("GET /api/reviews/:review_id", () => {
    it("200 OK: returns a review object", () => {
      return request(app)
        .get("/api/reviews/5")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: 5,
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              category: expect.any(String),
              owner: expect.any(String),
              created_at: expect.any(String),
            })
          );
        });
    });
    it("400 Bad Request: responds with 'review_id must be a number' when passed a review_id of the wrong type", () => {
      return request(app)
        .get("/api/reviews/cat")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("review_id must be a number");
        });
    });
    it.only("404 Not Found: responds with 'review_id not found' when passed a review_id that does not exist", () => {
      return request(app)
        .get("/api/reviews/9999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("review_id not found");
        });
    });
  });
  describe("Bad paths", () => {
    it("404 Not Found: invalid paths responds with 'Invalid Path'", () => {
      return request(app)
        .get("/api/categoriez")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid Path");
        });
    });
  });
});
