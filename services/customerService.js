const db = require("../config/dbConnect");
const AppError = require("../errors/AppError");

async function getService() {
  try {
    const [customer] = await db.query("SELECT * FROM Customers");
    return customer;
  } catch (error) {
    console.log(error);
    throw new AppError("Customer Retrive Error", 400);
  }
}

async function addService(
  customerName,
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
      "INSERT INTO Customers (customerName, email, phone, address, city, state, zipcode, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [customerName, email, phone, address, city, state, zipCode, country]
    );
    await conn.commit();
    return result.insertId;
  } catch (error) {
    await conn.rollback();
    console.log(error);
    throw new AppError("Customer Adding Error", 400);
  } finally {
    conn.release();
  }
}

module.exports = { getService, addService };
