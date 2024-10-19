const express = require("express");
const { authenticate } = require("../middlewares/auth");

const {
  getSupplier,
  addSupplier,
} = require("../controllers/supplierController");

const router = express.Router();

router.get("/", getSupplier);
router.post("/", authenticate, addSupplier);

module.exports = router;
