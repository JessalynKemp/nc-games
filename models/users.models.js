const db = require("../db/connection");
const { notString, notFound } = require("../error-messages/errors");

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((result) => {
    const users = result.rows;
    return users;
  });
};

exports.selectUser = (username) => {
  if (!isNaN(+username)) {
    return notString("username");
  }
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((result) => {
      const user = result.rows[0];
      if (!user) {
        return notFound("username");
      } else return user;
    });
};
