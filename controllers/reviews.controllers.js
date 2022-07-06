const {
  selectReviews,
  selectReview,
  modifyReviewVotes,
} = require("../models/reviews.models");
const { tooManyProps } = require("../error-messages/errors");

exports.getReviews = (req, res, next) => {
  const { sort_by } = req.query;
  selectReviews(sort_by)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReview = (req, res, next) => {
  const { review_id } = req.params;
  selectReview(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateReviewVotes = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;

  modifyReviewVotes(review_id, inc_votes)
    .then((review) => {
      if (Object.keys(req.body).length > 1) {
        return tooManyProps(req.body, "inc_votes");
      }
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
