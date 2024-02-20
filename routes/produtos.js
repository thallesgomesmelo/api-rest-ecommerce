const express = require("express");
const router = express.Router();

// Retorna todos os produtos.
router.get("/", (req, res, next) => {
  res.status(200).send({ message: "Usando o GET dentro da rota de produtos." });
});

// Retorna um produto.
router.get("/:id_produtos", (req, res, next) => {
  const id = req.params.id_produtos;

  res.status(200).send({ message: "Usando o GET de um produto exclusivo.", id });
});

// Adiciona um produto.
router.post("/", (req, res, next) => {
  res.status(201).send({ message: "Usando o POST dentro da rota de produtos." });
});

// Atualiza um produto expecifico.
router.patch("/", (req, res, next) => {
  res.status(201).send({ message: "Usando o PATCH dentro da rota de produtos." });
});

// Apaga um produto expecifico.
router.delete("/", (req, res, next) => {
  res.status(201).send({ message: "Usando o DELETE dentro da rota de produtos." });
});

module.exports = router;
