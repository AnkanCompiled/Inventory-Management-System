const express = require("express");

const { changeInventory } = require("../controllers/inventoryController");

const router = express.Router();

router.post("/adjustments", changeInventory);

module.exports = router;
