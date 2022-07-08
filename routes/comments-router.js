const commentsRouter = require("express").Router();
const {
  deleteComment,
  updateCommentVotes,
} = require("../controllers/comments.controllers");

commentsRouter.patch("/:comment_id", updateCommentVotes);

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
