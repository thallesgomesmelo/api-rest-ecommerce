const express = require("express");
const router = express.Router();

const login = require("../middleware/login");
const ImagensController = require("../controllers/imagensController");

router.delete("/:id_imagem", login.obrigatorio, ImagensController.deleteImagem);

module.exports = router;
