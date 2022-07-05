const {
  selectReview,
  selectReviewComments,
  modifyReviewVotes,
} = require("../models/reviews.models");

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

exports.getReviewComments = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
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
        return tooManyProps();
      }
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

function tooManyProps() {
  return Promise.reject({
    status: 400,
    msg: "only updates to inc_votes are available",
  });
}
