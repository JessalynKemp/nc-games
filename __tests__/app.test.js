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
    it("200 OK: returns an array sorted by votes in descending order (default) when the sort_by query is votes", () => {
      return request(app)
        .get("/api/reviews")
        .query({ sort_by: "votes" })
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("votes", { descending: true });
        });
    });
    it("200 OK: returns an array sorted by date in ascending order when the order query is asc", () => {
      return request(app)
        .get("/api/reviews")
        .query({ order: "asc" })
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at");
        });
    });
    it("200 OK: returns an array sorted by title in descending order when the order query is desc", () => {
      return request(app)
        .get("/api/reviews")
        .query({ sort_by: "title", order: "desc" })
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("title", { descending: true });
        });
    });
    it("200 OK: filters reviews by social deduction when the category query is social deduction", () => {
      return request(app)
        .get("/api/reviews")
        .query({ category: "social deduction" })
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toHaveLength(11);
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: "social deduction",
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
    it("200 OK: returns an empty array when the category exists but there are no reviews", () => {
      return request(app)
        .get("/api/reviews")
        .query({ category: "children's games" })
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toEqual([]);
        });
    });
    it("200 OK: all three queries work together", () => {
      return request(app)
        .get("/api/reviews")
        .query({ sort_by: "votes", order: "asc", category: "social deduction" })
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toHaveLength(11);
          expect(reviews).toBeSortedBy("votes");
        });
    });
    it("400 Bad Request: responds with 'cannot sort by review_body' when sort_by query is review_body", () => {
      return request(app)
        .get("/api/reviews")
        .query({ sort_by: "review_body" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("cannot sort by review_body");
        });
    });
    it("400 Bad Request: responds with 'sort_by must be a string' when sort_by query is a number", () => {
      return request(app)
        .get("/api/reviews")
        .query({ sort_by: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("sort_by must be a string");
        });
    });
    it("404 Not Found: responds with 'bananas not found' when sort_by query does not exist", () => {
      return request(app)
        .get("/api/reviews")
        .query({ sort_by: "bananas" })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bananas not found");
        });
    });
    it("400 Bad Request: responds with 'order must be asc or desc' when order query is not asc or desc", () => {
      return request(app)
        .get("/api/reviews")
        .query({ order: "bananas" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("order must be asc or desc");
        });
    });
    it("400 Bad Request: responds with 'category must be a string' when category query is a number", () => {
      return request(app)
        .get("/api/reviews")
        .query({ category: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("category must be a string");
        });
    });
    it("404 Not Found: responds with 'category not found' when category query does not exist", () => {
      return request(app)
        .get("/api/reviews")
        .query({ category: "campaign" })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("category not found");
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
          expect(msg).toBe("only inc_votes is required");
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
    it("400 Bad Request: responds with 'username and body not provided' when passed an empty request body", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("username and body not provided");
        });
    });
    it("400 Bad Request: responds with 'username not provided' when passed a request body that only contains a body", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ body: "testing" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("username not provided");
        });
    });
    it("400 Bad Request: responds with 'body not provided' when passed a request body that only contains a username", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ username: "dav3rid" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("body not provided");
        });
    });
    it("404 not found: responds with 'username not found' when passed a request body with a user who does not exist", () => {
      const newComment = {
        username: "J3ss",
        body: "Agricola is a detailed, strategic, and thoroughly engaging euro-style game about indirect competitive farming.",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("username not found");
        });
    });
    it("400 Bad Request: responds with 'body must be a string' when passed a body that is a number in the request", () => {
      const newComment = {
        username: "dav3rid",
        body: 1,
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("body must be a string");
        });
    });
    it("400 Bad Request: responds with 'only username and body are needed to post a comment' when passed '{inc_votes: 1, name: 'Mitch'}'", () => {
      const newComment = {
        username: "dav3rid",
        body: "Agricola is a detailed, strategic, and thoroughly engaging euro-style game about indirect competitive farming.",
        votes: 1000,
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("only username and body are required");
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
  describe("GET /api/users/:username", () => {
    it("200 OK: returns a user object for the username given", () => {
      return request(app)
        .get("/api/users/philippaclaire9")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: "philippaclaire9",
              avatar_url: expect.any(String),
              name: expect.any(String),
            })
          );
        });
    });
    it("400 Bad Request: responds with 'username must be a string' when passed a username of the wrong type", () => {
      return request(app)
        .get("/api/users/4")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("username must be a string");
        });
    });
    it("404 Not Found: responds with 'username not found' when passed a username that does not exist", () => {
      return request(app)
        .get("/api/users/bananac4t")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("username not found");
        });
    });
  });
  describe("PATCH /api/comments/:comment_id", () => {
    it("200 OK: returns the updated comment with +2 votes when { inc_votes : 2 } is received (increase)", () => {
      return request(app)
        .patch("/api/comments/6")
        .send({ inc_votes: 2 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual({
            comment_id: 6,
            body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
            votes: 12,
            author: "philippaclaire9",
            review_id: 3,
            created_at: "2021-03-27T19:49:48.110Z",
          });
        });
    });
    it("200 OK: returns the updated comment with -10 votes when { inc_votes : -10 } is received (decrease)", () => {
      return request(app)
        .patch("/api/comments/6")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual({
            comment_id: 6,
            body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
            votes: 0,
            author: "philippaclaire9",
            review_id: 3,
            created_at: "2021-03-27T19:49:48.110Z",
          });
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    it("204 No Content: deletes the comment with the given comment_id", () => {
      return request(app).delete("/api/comments/2").expect(204);
    });
    it("400 Bad Request: responds with 'comment_id must be a number' when passed a comment_id of the wrong type", () => {
      return request(app)
        .delete("/api/comments/cat")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("comment_id must be a number");
        });
    });
    it("404 Not Found: responds with 'comment_id not found' when passed a comment_id that does not exist", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("comment_id not found");
        });
    });
    it("404 Not Found: responds with 'comment_id not found' when passed a comment_id that has just been deleted", () => {
      return request(app)
        .delete("/api/comments/2")
        .then(() => {
          return request(app).delete("/api/comments/2").expect(404);
        });
    });
  });
  describe("GET /api", () => {
    it("200 OK: returns a json object containing all endpoints as keys with a description of what they do", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("endpoints");
          expect(body.endpoints).toHaveProperty("GET /api");
          expect(body.endpoints).toHaveProperty("GET /api/categories");
          expect(body.endpoints).toHaveProperty("GET /api/reviews");
          expect(body.endpoints).toHaveProperty("GET /api/users");
          expect(body.endpoints).toHaveProperty("GET /api/reviews/:review_id");
          expect(body.endpoints).toHaveProperty(
            "GET /api/reviews/:review_id/comments"
          );
          expect(body.endpoints).toHaveProperty(
            "PATCH /api/reviews/:review_id"
          );
          expect(body.endpoints).toHaveProperty(
            "POST /api/reviews/:review_id/comments"
          );
          expect(body.endpoints).toHaveProperty(
            "DELETE /api/comments/:comment_id"
          );
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
