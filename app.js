const express = require("express");

const { getUsers } = require("./controllers/users.controllers");
const {
  getReviewComments,
  postCommentOnReview,
  deleteComment,
} = require("./controllers/comments.controllers");
const apiRouter = require("./routes/api-router");
const categoriesRouter = require("./routes/categories-router");
const reviewsRouter = require("./routes/reviews-router");

const app = express();
app.use(express.json());

// API
app.use("/api", apiRouter);

// Categories
apiRouter.use("/categories", categoriesRouter);

// Reviews
apiRouter.use("/reviews", reviewsRouter);

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
