exports.tooManyPropsReviews = () => {
  return Promise.reject({
    status: 400,
    msg: "only updates to inc_votes are available",
  });
};

exports.tooManyPropsComments = () => {
  return Promise.reject({
    status: 400,
    msg: "only username and body are needed to post a comment",
  });
};

exports.idNotFound = () => {
  return Promise.reject({ status: 404, msg: "review_id not found" });
};

exports.idNotNumber = () => {
  return Promise.reject({ status: 400, msg: "review_id must be a number" });
};

exports.incVotesNotNumber = () => {
  return Promise.reject({ status: 400, msg: "inc_votes must be a number" });
};

exports.usernameNotFound = () => {
  return Promise.reject({ status: 404, msg: "username not found" });
};

exports.bodyNotString = () => {
  return Promise.reject({ status: 400, msg: "body must be a string" });
};
