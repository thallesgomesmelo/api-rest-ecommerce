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
const ProductsController = require("../controllers/productsController");

router.get("/", ProductsController.getProducts);
router.get("/:productId", ProductsController.getOneProduct);
router.post(
  "/",
  login.required,
  upload.single("imageProduct"),
  ProductsController.postProduct
);
router.patch("/", login.required, ProductsController.updateProduct);
router.delete("/", login.required, ProductsController.deleteProduct);

// Rotas imagem
router.post(
  "/:productId/image",
  login.required,
  upload.single("imageProduct"),
  ProductsController.postImage
);
router.get("/:productId/images", ProductsController.getImages);

module.exports = router;
