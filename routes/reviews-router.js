const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReview,
  updateReviewVotes,
} = require("../controllers/reviews.controllers");

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReview);

reviewsRouter.patch("/:review_id", updateReviewVotes);

module.exports = reviewsRouter;
