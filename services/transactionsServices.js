import db from "../config/dbConnect.js";
import AppError from "../errors/AppError.js";
import createPDF from "./pdfService.js";
import emailService from "../services/emailService.js";

async function getService() {
  try {
    const [transactions] = await db.query("SELECT * FROM Transactions");
    return transactions;
  } catch (error) {
    console.log(error);
    throw new AppError("Transactions Retrive Error", 400);
  }
}

async function addService(customerId, transactionDate, totalAmount, items) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.execute(
      "INSERT INTO Transactions (customerId, transactionDate, totalAmount) VALUES (?, ?, ?)",
      [customerId, transactionDate, totalAmount]
    );
    for (let item of items) {
      let subtotal = item.unitPrice;
      if (item.quantity > 1) {
        subtotal *= item.quantity;
      }
      await conn.execute(
        "INSERT INTO Transactiondetails (TransactionID, ProductID, Quantity, UnitPrice, Subtotal) VALUES (?, ?, ?, ?, ?)",
        [
          result.insertId,
          item.productId,
          item.quantity,
          item.unitPrice,
          subtotal,
        ]
      );
    }
    let data = { totalAmount, items };
    await createPDF(data);
    const [customer] = await db.execute(
      "SELECT * FROM Customers WHERE customerId = ?",
      [customerId]
    );
    emailService.sendInvoice(customer[0], transactionDate);
    await conn.commit();
    return result.insertId;
  } catch (error) {
    await conn.rollback();
    console.log(error);
    throw new AppError("Transactions Adding Error", 400);
  } finally {
    conn.release();
  }
}

export default { getService, addService };
