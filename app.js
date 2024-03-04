const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const routeProducts = require("./routes/productsRoute");
const routeOrders = require("./routes/ordersRoute");
const routeUsers = require("./routes/usersRoute");
const routeImages = require("./routes/imagesRoute");

const app = express(); // Instancia

app.use(morgan("dev")); // Retorna logs durante o momento de desenvolvimento.
app.use("/uploads", express.static("uploads")); // Fazendo com que pasta upload fica desponivel publicamente.
app.use(bodyParser.urlencoded({ extended: false })); // Apenas dados simples.
app.use(bodyParser.json()); // Aceita entrada no body em json.

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");

    return res.status(200).send({});
  }

  next();
});

app.use("/products", routeProducts);
app.use("/orders", routeOrders);
app.use("/users", routeUsers);
app.use("/images", routeImages);

/**
 * Quando passar por todas as rotas acima e
 * não entrar em nunhuma vai ser usado este metodo.
 */
app.use((req, res, next) => {
  const erro = new Error("Não encontrado");

  erro.status = 404;

  next(erro);
});

// Utilizado para quando ocorrer algum erro em alguma rota a cima.
app.use((erro, req, res, next) => {
  res.status(erro.status || 500);
  return res.json({
    erro: {
      message: erro.message
    }
  });
});

module.exports = app;
