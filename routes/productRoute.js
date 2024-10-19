const express = require("express");
const { authenticate } = require("../middlewares/auth");

const {
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProduct);
router.get("/:id", getProduct);
router.post("/", authenticate, addProduct);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

module.exports = router;
