const {
  selectReviewComments,
  addCommentOnReview,
  removeComment,
} = require("../models/comments.models");
const { tooManyProps } = require("../error-messages/errors");

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

exports.postCommentOnReview = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;
  addCommentOnReview(review_id, username, body)
    .then((comment) => {
      if (Object.keys(req.body).length > 2) {
        return tooManyProps(req.body, "username", "body");
      }
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then((deletedComment) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
