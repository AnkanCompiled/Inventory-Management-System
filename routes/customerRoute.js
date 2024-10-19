const express = require("express");

const {
  getCustomer,
  addCustomer,
} = require("../controllers/customerController");

const router = express.Router();

router.get("/", getCustomer);
router.post("/", addCustomer);

module.exports = router;
