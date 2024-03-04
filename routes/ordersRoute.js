const express = require("express");
const router = express.Router();

const OrdersController = require("../controllers/ordersController");

router.get("/", OrdersController.getOrders);
router.get("/:orderId", OrdersController.getOneOrder);
router.post("/", OrdersController.postOrder);
router.delete("/", OrdersController.deleteOrder);

module.exports = router;
