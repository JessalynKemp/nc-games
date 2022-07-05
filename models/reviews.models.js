const db = require("../db/connection");
const pg = require("pg-format");

function idNotFound() {
  return Promise.reject({ status: 404, msg: "review_id not found" });
}

function idNotNumber() {
  return Promise.reject({ status: 400, msg: "review_id must be a number" });
}

function incVotesNotNumber() {
  return Promise.reject({ status: 400, msg: "inc_votes must be a number" });
}

exports.selectReviews = () => {
  return db
    .query(
      `
    SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count 
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;
    `
    )
    .then((result) => {
      const reviews = result.rows;
      return reviews;
    });
};

exports.selectReview = (review_id) => {
  if (isNaN(+review_id)) {
    return idNotNumber();
  }
  return db
    .query(
      `
    SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count 
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id
    `,
      [review_id]
    )
    .then((result) => {
      const review = result.rows[0];
      if (!review) {
        return idNotFound();
      } else return review;
    });
};

exports.selectReviewComments = (review_id) => {
  if (isNaN(+review_id)) {
    return idNotNumber();
  }
  return db
    .query(
      `
  SELECT * FROM comments
  WHERE review_id = $1
  `,
      [review_id]
    )
    .then((result) => {
      const comments = result.rows;
      return comments;
    });
};

exports.modifyReviewVotes = (review_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "inc_votes not provided" });
  }
  if (isNaN(+inc_votes)) {
    return incVotesNotNumber();
  }
  return db
    .query(
      "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *",
      [inc_votes, review_id]
    )
    .then((result) => {
      const review = result.rows[0];
      if (!review) {
        return idNotFound();
      } else return review;
    });
};
