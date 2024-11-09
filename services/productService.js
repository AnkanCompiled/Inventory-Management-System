import xlsx from "xlsx";
import db from "../config/dbConnect.js";
import client from "../config/redisConnect.js";
import AppError from "../errors/AppError.js";

async function getService(id) {
  try {
    if (id) {
      const cachedData = await client.get(`productCache:${id}`);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const [product] = await db.query(
        `SELECT * FROM Products WHERE ProductID = ${id}`
      );
      await client.set(
        `“productCache:${product[0].ProductID}`,
        JSON.stringify(product[0]),
        {
          EX: 900,
        }
      );
      return product[0];
    }
    const [product] = await db.query(`SELECT * FROM Products `);
    return product;
  } catch (error) {
    throw new AppError("Product does not exist", 404);
  }
}

async function addService(
  productName,
  categoryId,
  supplierId,
  quantityInStock,
  price,
  description
) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.execute(
      "INSERT INTO Products (productName, categoryId, supplierId, quantityInStock, price, description) VALUES (?, ?, ?, ?, ?, ?)",
      [productName, categoryId, supplierId, quantityInStock, price, description]
    );
    const [output] = await conn.execute(
      `SELECT * FROM Products WHERE ProductID = ${result.insertId}`
    );

    await client.set(
      `productCache:${result.insertId}`,
      JSON.stringify(output[0]),
      {
        EX: 900,
      }
    );

    await conn.commit();
    return result.insertId;
  } catch (error) {
    await conn.rollback();
    throw new AppError(error.message, 400);
  } finally {
    conn.release();
  }
}

async function addExcelService(file) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const workbook = xlsx.read(file.data, { type: "buffer" });
    const worksheet = workbook.Sheets["Product"];
    const data = xlsx.utils.sheet_to_json(worksheet);
    for (const entry of data) {
      const [result] = await conn.execute(
        "INSERT IGNORE INTO Products (productName, categoryId, supplierId, quantityInStock, price, description) VALUES (?, ?, ?, ?, ?, ?)",
        [
          entry.productName,
          entry.categoryId,
          entry.supplierId,
          entry.quantityInStock,
          entry.price,
          entry.description,
        ]
      );
      if (result.affectedRows > 0) {
        const [output] = await conn.execute(
          "SELECT * FROM Products WHERE ProductID = ?",
          [result.insertId]
        );
        await client.set(
          `productCache:${result.insertId}`,
          JSON.stringify(output[0]),
          {
            EX: 900,
          }
        );
      }
    }

    await conn.commit();
    return data;
  } catch (error) {
    await conn.rollback();
    console.log(error);
    throw new AppError(error.message, 400);
  } finally {
    conn.release();
  }
}

async function updateService(
  id,
  productName,
  categoryId,
  supplierId,
  quantityInStock,
  price,
  description
) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE Products 
       SET productName = ?, categoryId = ?, supplierId = ?, quantityInStock = ?, price = ?, description = ? 
       WHERE productid = ?`,
      [
        productName,
        categoryId,
        supplierId,
        quantityInStock,
        price,
        description,
        id,
      ]
    );
    const [output] = await conn.execute(
      `SELECT * FROM Products WHERE ProductID = ${id}`
    );

    await client.set(`productCache:${id}`, JSON.stringify(output[0]), {
      EX: 900,
    });

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw new AppError(error.message, 404);
  } finally {
    conn.release();
  }
}

async function deleteService(id) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute("DELETE FROM Products WHERE productid = (?)", [id]);

    await client.del(`productCache:${id}`);

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw new AppError("Product does not exist", 404);
  } finally {
    conn.release();
  }
}

export default {
  getService,
  addService,
  addExcelService,
  updateService,
  deleteService,
};
