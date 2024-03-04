const express = require("express");
const router = express.Router();

const UserController = require("../controllers/usersController");

router.post("/", UserController.createUser);
router.post("/login", UserController.Login);

module.exports = router;
