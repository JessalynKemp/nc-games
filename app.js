const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const {
  getReviews,
  getReview,
  updateReviewVotes,
} = require("./controllers/reviews.controllers");
const { getUsers } = require("./controllers/users.controllers");
const {
  getReviewComments,
  postCommentOnReview,
  deleteComment,
} = require("./controllers/comments.controllers");
const apiRouter = require("./routes/api-router");

const app = express();
app.use(express.json());

// API
app.use("/api", apiRouter);

// Categories
app.get("/api/categories", getCategories);

// Reviews
// -- GET
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReview);
// -- PATCH
app.patch("/api/reviews/:review_id", updateReviewVotes);

// Users
app.get("/api/users", getUsers);

// Comments
// -- GET
app.get("/api/reviews/:review_id/comments", getReviewComments);
// -- POST
app.post("/api/reviews/:review_id/comments", postCommentOnReview);
// -- DELETE
app.delete("/api/comments/:comment_id", deleteComment);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
});

// Error handling
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error" });
});

module.exports = app;
