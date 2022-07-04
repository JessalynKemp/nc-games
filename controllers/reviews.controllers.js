const { selectReview } = require("../models/reviews.models");

exports.getReview = (req, res) => {
  const { review_id } = req.params;
  selectReview(review_id).then((review) => {
    res.status(200).send({ review });
  });
};
