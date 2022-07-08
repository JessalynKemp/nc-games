const db = require("../db/connection");
const {
  notNumber,
  notFound,
  notString,
  notProvided,
} = require("../error-messages/errors");

function checkReviewIDExists(review_id) {
  if (!review_id) return;
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return notFound("review_id");
      }
    });
}

function checkUserExists(username) {
  if (!username) return;
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return notFound("username");
      }
    });
}

exports.selectReviewComments = (review_id) => {
  if (isNaN(+review_id)) {
    return notNumber("review_id");
  }
  return Promise.all([
    db.query(
      `
    SELECT * FROM comments
    WHERE review_id = $1
    `,
      [review_id]
    ),
    checkReviewIDExists(review_id),
  ]).then(([result]) => {
    const comments = result.rows;
    return comments;
  });
};

exports.addCommentOnReview = (review_id, username, body) => {
  if (isNaN(+review_id)) {
    return notNumber("review_id");
  }
  if (username === undefined && body === undefined) {
    return notProvided("username", "body");
  } else if (username === undefined) {
    return notProvided("username");
  } else if (body === undefined) {
    return notProvided("body");
  }
  if (typeof body !== "string") {
    return notString("body");
  }
  return Promise.all([
    checkReviewIDExists(review_id),
    checkUserExists(username),
    db.query(
      `
    INSERT INTO comments (body, review_id, author, votes)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
      [body, review_id, username, 0]
    ),
    ,
  ]).then(([, , result]) => {
    const comment = result.rows[0];
    return comment;
  });
};

exports.removeComment = (comment_id) => {
  if (isNaN(+comment_id)) {
    return notNumber("comment_id");
  }
  return db
    .query(
      `
    DELETE FROM comments WHERE comment_id = $1 RETURNING *
  `,
      [comment_id]
    )
    .then((result) => {
      const deletedComment = result.rows[0];
      if (!deletedComment) {
        return notFound("comment_id");
      } else return deletedComment;
    });
};

exports.modifyCommentVotes = (comment_id, inc_votes) => {
  if (inc_votes === undefined) {
    return notProvided("inc_votes");
  }
  if (isNaN(+inc_votes)) {
    return notNumber("inc_votes");
  }
  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *",
      [inc_votes, comment_id]
    )
    .then((result) => {
      const comment = result.rows[0];
      if (!comment) {
        return notFound("comment_id");
      } else return comment;
    });
};
