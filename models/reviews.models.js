const db = require("../db/connection");
const {
  notFound,
  notNumber,
  notProvided,
  cannotSort,
} = require("../error-messages/errors");

exports.selectReviews = (sort_by = "created_at", order = "desc", category) => {
  const validSorts = [
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "created_at",
    "votes",
    "comment_count",
  ];
  if (!validSorts.includes(sort_by)) {
    return cannotSort(sort_by);
  }
  let queryStr = `
  SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count 
  FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id 
  `;
  const queryValues = [];
  if (category) {
    queryStr += `WHERE category = $1`;
    queryValues.push(category);
  }
  queryStr += `  
    GROUP BY reviews.review_id
    ORDER BY ${sort_by} ${order}
   `;
  return db.query(queryStr, queryValues).then((result) => {
    const reviews = result.rows;
    return reviews;
  });
};

exports.selectReview = (review_id) => {
  if (isNaN(+review_id)) {
    return notNumber("review_id");
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
        return notFound("review_id");
      } else return review;
    });
};

exports.modifyReviewVotes = (review_id, inc_votes) => {
  if (inc_votes === undefined) {
    return notProvided("inc_votes");
  }
  if (isNaN(+inc_votes)) {
    return notNumber("inc_votes");
  }
  return db
    .query(
      "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *",
      [inc_votes, review_id]
    )
    .then((result) => {
      const review = result.rows[0];
      if (!review) {
        return notFound("review_id");
      } else return review;
    });
};
