const express = require("express");
const { authenticate } = require("../middlewares/auth");

const {
  getTransaction,
  addTransaction,
} = require("../controllers/transactionsController");

const router = express.Router();

router.get("/", authenticate, getTransaction);
router.post("/", addTransaction);

module.exports = router;
