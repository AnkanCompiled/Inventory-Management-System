import xlsx from "xlsx";
import db from "../config/dbConnect.js";
import AppError from "../errors/AppError.js";

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

async function addExcelService(file) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const workbook = xlsx.read(file.data, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    data.forEach((entry) => {
      conn.execute(
        "INSERT IGNORE INTO Customers (customerName, email, phone, address, city, state, zipcode, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          entry.customerName,
          entry.email,
          entry.phone,
          entry.address,
          entry.city,
          entry.state,
          entry.zipCode,
          entry.country,
        ]
      );
    });
    await conn.commit();
    return data;
  } catch (error) {
    await conn.rollback();
    console.log(error);
    throw new AppError("Customer Adding Error", 400);
  } finally {
    conn.release();
  }
}

export default { getService, addService, addExcelService };
