const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/usuariosController");

router.post("/cadastro", UsuarioController.cadastroUsuario);
router.post("/login", UsuarioController.Login);

module.exports = router;
