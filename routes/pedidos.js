const express = require("express");
const router = express.Router();

// Retorna todos os pedidos.
router.get("/", (req, res, next) => {
  res.status(200).send({ message: "Usando o GET dentro da rota de pedidos." });
});

// Retorna um pedido.
router.get("/:id_pedidos", (req, res, next) => {
  const id = req.params.id_pedidos;

  res.status(200).send({ message: "Usando o GET de um pedido exclusivo.", id });
});

// Adiciona um pedidos.
router.post("/", (req, res, next) => {
  res.status(201).send({ message: "Usando o POST dentro da rota de pedidos." });
});

// Atualiza um pedido expecifico.
router.patch("/", (req, res, next) => {
  res.status(201).send({ message: "Usando o PATCH dentro da rota de pedido." });
});

// Apaga um pedido expecifico.
router.delete("/", (req, res, next) => {
  res.status(201).send({ message: "Usando o DELETE dentro da rota de pedido." });
});

module.exports = router;
