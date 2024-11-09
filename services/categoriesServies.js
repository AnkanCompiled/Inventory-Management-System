import db from "../config/dbConnect.js";
import client from "../config/redisConnect.js";
import AppError from "../errors/AppError.js";

async function getService(id) {
  try {
    const cachedData = await client.get(`categoryCache:${id}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const [category] = await db.query(
      `SELECT * FROM Categories WHERE categoryid = ${id}`
    );

    await client.set(`categoryCache:${id}`, JSON.stringify(category[0]), {
      EX: 900,
    });

    return category[0];
  } catch (error) {
    throw new AppError("Category does not exist", 404);
  }
}

async function addService(categoryName, description) {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.execute(
      "INSERT INTO Categories (categoryName, description) VALUES (?, ?)",
      [categoryName, description]
    );
    const [output] = await conn.query(
      `SELECT * FROM Categories WHERE categoryid = ${result.insertId}`
    );

    await client.set(
      `categoryCache:${result.insertId}`,
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

async function deleteService(id) {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute("DELETE FROM categories WHERE categoryid = (?)", [id]);

    await client.del(`categoryCache:${id}`);

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw new AppError("Category does not exist", 404);
  } finally {
    conn.release();
  }
}

export default { getService, addService, deleteService };
