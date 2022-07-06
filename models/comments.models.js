const db = require("../db/connection");
const {
  idNotNumber,
  idNotFound,
  usernameNotFound,
  bodyNotString,
} = require("../error-messages/errors");

function checkReviewIDExists(review_id) {
  if (!review_id) return;
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return idNotFound();
      }
    });
}

function checkUserExists(username) {
  if (!username) return;
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return usernameNotFound();
      }
    });
}

exports.selectReviewComments = (review_id) => {
  if (isNaN(+review_id)) {
    return idNotNumber();
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
    return idNotNumber();
  }
  if (username === undefined || body === undefined) {
    return Promise.reject({
      status: 400,
      msg: "username and body not provided",
    });
  }
  if (typeof body !== "string") {
    return bodyNotString();
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
