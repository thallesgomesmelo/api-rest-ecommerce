const express = require("express");
const router = express.Router();

// Usado para adicionar arquivo do tipo imagem ao banco de dados.
const multer = require("multer");
const storage = multer.diskStorage({
  // Onde será salvo.
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  // Nome do arquivo.
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
// Criando um filtro para o tipo de arquivo aceito.
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  // Adidiconado limite de tamanho do arquivo para 5Mb
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const login = require("../middleware/login");
const ProdutosController = require("../controllers/produtosController");

router.get("/", ProdutosController.getProdutos);
router.get("/:id_produto", ProdutosController.getUmProduto);
router.post(
  "/",
  login.obrigatorio,
  upload.single("produto_imagem"),
  ProdutosController.postProduto
);
router.patch("/", login.obrigatorio, ProdutosController.pathProduto);
router.delete("/", login.obrigatorio, ProdutosController.deleteProduto);

// Rotas imagem
router.post(
  "/:id_produto/imagem",
  login.obrigatorio,
  upload.single("produto_imagem"),
  ProdutosController.postImagem
);
router.get("/:id_produto/imagem", ProdutosController.getImagens);

module.exports = router;
