const {
  selectReviews,
  selectReview,
  modifyReviewVotes,
  addReview,
} = require("../models/reviews.models");
const { tooManyProps } = require("../error-messages/errors");

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  selectReviews(sort_by, order, category)
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
  const requestBody = req.body;
  modifyReviewVotes(requestBody, review_id, inc_votes)
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

exports.postReview = (req, res, next) => {
  const { owner, title, review_body, designer, category } = req.body;
  const requestBody = req.body;
  addReview(requestBody, owner, title, review_body, designer, category)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
