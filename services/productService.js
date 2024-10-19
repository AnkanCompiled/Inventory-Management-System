const db = require("../config/dbConnect");
const client = require("../config/redisConnect");
const AppError = require("../errors/AppError");

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

module.exports = { getService, addService, updateService, deleteService };
