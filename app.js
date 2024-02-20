const express = require("express");
const rotaProdutos = require("./routes/produtos");
const rotaPedidos = require("./routes/pedidos");

const app = express(); // Intancia

app.use("/produtos", rotaProdutos);
app.use("/pedidos", rotaPedidos);

module.exports = app;
