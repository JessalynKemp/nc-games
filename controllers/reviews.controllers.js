const { selectReview, modifyReviewVotes } = require("../models/reviews.models");

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

exports.updateReviewVotes = (req, res) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  modifyReviewVotes(review_id, inc_votes).then((review) => {
    res.status(200).send({ review });
  });
};
