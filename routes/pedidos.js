const express = require("express");
const router = express.Router();

const PedidosController = require("../controllers/pedidosController");

router.get("/", PedidosController.getPedidos);
router.get("/:id_pedidos", PedidosController.getUmPedido);
router.post("/", PedidosController.postPedidos);
router.delete("/", PedidosController.deletePedido);

module.exports = router;
