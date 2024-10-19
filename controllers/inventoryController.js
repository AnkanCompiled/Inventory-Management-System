const { changeService } = require("../services/inventoryService");

async function changeInventory(req, res, next) {
  try {
    const inventoryId = await changeService(
      req.body.productId,
      req.body.adjustmentType,
      req.body.quantityChanged,
      req.body.reason
    );
    res.status(201).json({
      message: "Adjustment recorded successfully",
      inventoryId: inventoryId,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { changeInventory };
