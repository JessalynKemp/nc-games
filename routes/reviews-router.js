const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReview,
  updateReviewVotes,
  postReview,
} = require("../controllers/reviews.controllers");
const {
  getReviewComments,
  postCommentOnReview,
} = require("../controllers/comments.controllers");

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReview);
reviewsRouter.get("/:review_id/comments", getReviewComments);

reviewsRouter.patch("/:review_id", updateReviewVotes);

reviewsRouter.post("/", postReview);
reviewsRouter.post("/:review_id/comments", postCommentOnReview);

module.exports = reviewsRouter;
