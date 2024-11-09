import inventoryService from "../services/inventoryService.js";

async function changeInventory(req, res, next) {
  try {
    const inventoryId = await inventoryService.changeService(
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

export default { changeInventory };
