const express = require("express");

const apiRouter = require("./routes/api-router");
const categoriesRouter = require("./routes/categories-router");
const reviewsRouter = require("./routes/reviews-router");
const usersRouter = require("./routes/users-router");
const commentsRouter = require("./routes/comments-router");

const app = express();
app.use(express.json());

// API
app.use("/api", apiRouter);

// Categories
apiRouter.use("/categories", categoriesRouter);

// Reviews
apiRouter.use("/reviews", reviewsRouter);

// Users
apiRouter.use("/users", usersRouter);

// Comments
apiRouter.use("/comments", commentsRouter);
// app.delete("/api/comments/:comment_id", deleteComment);

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
