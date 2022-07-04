const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");

const app = express();

app.get("/api/categories", getCategories);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
});

module.exports = app;
