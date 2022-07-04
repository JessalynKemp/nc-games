const db = require("../db/connection");
const pg = require("pg-format");

function idNotFound() {
  return Promise.reject({ status: 404, msg: "review_id not found" });
}

function idNotNumber() {
  return Promise.reject({ status: 400, msg: "review_id must be a number" });
}

exports.selectReview = (review_id) => {
  if (isNaN(+review_id)) {
    return idNotNumber();
  }
  return db
    .query("SELECT * FROM reviews WHERE review_id=$1", [review_id])
    .then((result) => {
      const review = result.rows[0];
      if (!review) {
        return idNotFound();
      } else return review;
    });
};

exports.modifyReviewVotes = (review_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "inc_votes not provided" });
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
