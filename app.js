const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const {
  getReview,
  getReviewComments,
  updateReviewVotes,
} = require("./controllers/reviews.controllers");
const { getUsers } = require("./controllers/users.controllers");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);
app.get("/api/reviews/:review_id/comments", getReviewComments);
app.patch("/api/reviews/:review_id", updateReviewVotes);

app.get("/api/users", getUsers);

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
