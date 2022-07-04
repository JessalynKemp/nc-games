const db = require("../db/connection");
const pg = require("pg-format");

exports.selectReview = (review_id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id=$1", [review_id])
    .then((result) => {
      const review = result.rows[0];
      if (!review) {
        return Promise.reject({ status: 404, msg: "review_id not found" });
      } else return review;
    });
};
