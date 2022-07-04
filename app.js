const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const {
  getReview,
  updateReviewVotes,
} = require("./controllers/reviews.controllers");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);
app.patch("/api/reviews/:review_id", updateReviewVotes);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
});

// Error handling
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

// Is there a way to make this error more dynamic? I.e. refer to review_id dynamically?
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: `review_id must be a number` });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error" });
});

module.exports = app;
