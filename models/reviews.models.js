const db = require("../db/connection");
const pg = require("pg-format");

function idNotFound() {
  return Promise.reject({ status: 404, msg: "review_id not found" });
}

exports.selectReview = (review_id) => {
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
