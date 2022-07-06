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
            expect(category).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });
  describe("GET /api/reviews", () => {
    it("200 OK: returns an array of review objects under the key of 'reviews'", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toHaveLength(13);
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              review_body: expect.any(String),
              designer: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    it("200 OK: returns an array of review objects sorted by date in descending order", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at", { descending: true });
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
    it("200 OK: the review object has a comment_count property", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review.comment_count).toBe(3);
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
    it("404 Not Found: responds with 'review_id not found' when passed a review_id that does not exist", () => {
      return request(app)
        .get("/api/reviews/9999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("review_id not found");
        });
    });
  });

  describe("PATCH /api/reviews/:review_id", () => {
    it("200 OK: returns the updated review with +7 votes when { inc_votes : 7 } is received (increase)", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: 7 })
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 12,
          });
        });
    });
    it("200 OK: returns the updated review with -3 votes when { inc_votes : -3 } is received (decrease)", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: -3 })
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 2,
          });
        });
    });
    it("404 Not Found: responds with 'review_id not found' when passed a review_id that does not exist", () => {
      return request(app)
        .patch("/api/reviews/9999")
        .send({ inc_votes: -3 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("review_id not found");
        });
    });
    it("400 Bad Request: responds with 'inc_votes not provided' when passed an empty request body", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("inc_votes not provided");
        });
    });
    it("400 Bad Request: responds with 'inc_votes must be a number' when passed '{inc_votes: 'cat'}'", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: "cat" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("inc_votes must be a number");
        });
    });
    it("400 Bad Request: responds with 'only updates to inc_votes are available' when passed '{inc_votes: 1, name: 'Mitch'}'", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: 1, name: "Mitch" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("only updates to inc_votes are available");
        });
    });
  });
  describe("GET /api/reviews/:review_id/comments", () => {
    it("returns an array of comments for the given review_id under the key of 'comments'", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(3);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: 2,
            });
          });
        });
    });
    it("200 OK: responds with an empty array when the review_id exists but there are no comments", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
    it("400 Bad Request: responds with 'review_id must be a number' when passed a review_id of the wrong type", () => {
      return request(app)
        .get("/api/reviews/cat/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("review_id must be a number");
        });
    });
    it("404 Not Found: responds with 'review_id not found' when passed a review_id that does not exist", () => {
      return request(app)
        .get("/api/reviews/9999/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("review_id not found");
        });
    });
  });
  describe("POST /api/reviews/:review_id/comments", () => {
    it("201 created: returns the new comment object that has been added to the comments table", () => {
      const newComment = {
        username: "dav3rid",
        body: "Agricola is a detailed, strategic, and thoroughly engaging euro-style game about indirect competitive farming.",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: 7,
            votes: 0,
            created_at: expect.any(String),
            author: "dav3rid",
            body: "Agricola is a detailed, strategic, and thoroughly engaging euro-style game about indirect competitive farming.",
            review_id: 1,
          });
        });
    });
    it("400 Bad Request: responds with 'review_id must be a number' when passed a review_id of the wrong type", () => {
      const newComment = {
        username: "dav3rid",
        body: "Agricola is a detailed, strategic, and thoroughly engaging euro-style game about indirect competitive farming.",
      };
      return request(app)
        .post("/api/reviews/cat/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("review_id must be a number");
        });
    });
    it("404 Not Found: responds with 'review_id not found' when passed a review_id that does not exist", () => {
      const newComment = {
        username: "dav3rid",
        body: "Agricola is a detailed, strategic, and thoroughly engaging euro-style game about indirect competitive farming.",
      };
      return request(app)
        .post("/api/reviews/9999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("review_id not found");
        });
    });
  });
  describe("GET /api/users", () => {
    it("200 OK: returns an array of user objects under the key of 'users'", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
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
