const express = require("express");

const { registerUser, loginUser } = require("../controllers/userController");
const customerRoute = require("./customerRoute");
const productRoute = require("./productRoute");
const supplierRoute = require("./supplierRoute");
const categoriesRoute = require("./categoriesRoute");
const transactionsRoute = require("./transactionRoute");
const inventoryRoute = require("./inventoryRoute");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.use("/products", productRoute);
router.use("/customers", customerRoute);
router.use("/suppliers", supplierRoute);
router.use("/categories", categoriesRoute);
router.use("/transactions", transactionsRoute);
router.use("/inventory", inventoryRoute);

module.exports = router;
