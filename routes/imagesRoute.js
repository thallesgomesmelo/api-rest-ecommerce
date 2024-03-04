const express = require("express");
const router = express.Router();

const login = require("../middleware/login");
const ImagesController = require("../controllers/imagesController");

router.delete("/:imageId", login.required, ImagesController.deleteImage);

module.exports = router;
