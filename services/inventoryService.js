const db = require("../config/dbConnect");
const AppError = require("../errors/AppError");

async function changeService(
  productId,
  adjustmentType,
  quantityChanged,
  reason
) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.execute(
      "INSERT INTO inventoryadjustments (productId, adjustmentType, quantityChanged, reason) VALUES (?, ?, ?, ?)",
      [productId, adjustmentType, quantityChanged, reason]
    );
    await conn.commit();
    return result.insertId;
  } catch (error) {
    await conn.rollback();
    console.log(error);
    throw new AppError("Adjustment Adding Error", 400);
  } finally {
    conn.release();
  }
}

module.exports = { changeService };
