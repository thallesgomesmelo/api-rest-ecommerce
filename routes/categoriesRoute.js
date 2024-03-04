const express = require("express");
const router = express.Router();

const login = require("../middleware/login");
const CategoriesController = require("../controllers/categoriesController");

router.get("/", CategoriesController.getCategories);
router.post("/", login.required, CategoriesController.postCategory);

module.exports = router;
