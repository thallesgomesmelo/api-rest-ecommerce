const express = require("express");
const morgan = require("morgan");

const rotaProdutos = require("./routes/produtos");
const rotaPedidos = require("./routes/pedidos");

const app = express(); // Intancia

// Retorna logs durante o momento de desenvolvimento.
app.use(morgan("dev"));

app.use("/produtos", rotaProdutos);
app.use("/pedidos", rotaPedidos);

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
