const express = require("express");
const { authenticate } = require("../middlewares/auth");

const {
  getCategory,
  addCategory,
  deleteCategory,
} = require("../controllers/categoriesController");

const router = express.Router();

router.get("/:id", getCategory);
router.post("/", authenticate, addCategory);
router.delete("/:id", authenticate, deleteCategory);

module.exports = router;
