const db = require("../config/dbConnect");
const AppError = require("../errors/AppError");

async function getService() {
  try {
    const [supplier] = await db.query("SELECT * FROM Suppliers");
    return supplier;
  } catch (error) {
    console.log(error);
    throw new AppError(error.message, 400);
  }
}

async function addService(
  supplierName,
  contactName,
  email,
  phone,
  address,
  city,
  state,
  zipCode,
  country
) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.execute(
      "INSERT INTO Suppliers (supplierName, contactName, email, phone, address, city, state, zipcode, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        supplierName,
        contactName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
      ]
    );
    await conn.commit();
    return result.insertId;
  } catch (error) {
    await conn.rollback();
    console.log(error);
    throw new AppError(error.message, 400);
  } finally {
    conn.release();
  }
}

module.exports = { getService, addService };
