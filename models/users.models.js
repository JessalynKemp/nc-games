const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((result) => {
    const users = result.rows;
    return users;
  });
};

exports.selectUser = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((result) => {
      const user = result.rows[0];
      return user;
    });
};
