const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const { getReview } = require("./controllers/reviews.controllers");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: `review_id must be a number` });
  } else next(err);
});

module.exports = app;
