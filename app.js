const express = require("express");

const app = express(); // Intancia

app.use((req, res, next) => {
  res.status(200).send({ message: "OK, Sucesso" });
});

module.exports = app;
