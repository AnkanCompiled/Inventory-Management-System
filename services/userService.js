const db = require("../config/dbConnect");
const AppError = require("../errors/AppError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

async function registerService(username, password, role, email, fullname) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.execute(
      "INSERT INTO Users (username, password, role, email, fullname) VALUES (?, ?, ?, ?, ?)",
      [username, hashedPassword, role, email, fullname]
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

async function loginService(username, password) {
  try {
    const [userDetails] = await db.execute(
      "SELECT * FROM Users WHERE username = ?",
      [username]
    );
    if (userDetails[0] === undefined) {
      throw new Error("Username Not Found");
    }
    const isMatch = await bcrypt.compare(password, userDetails[0].password);
    if (!isMatch) {
      throw new Error("Password Doesnot Match");
    }
    const token = jwt.sign({ user: userDetails }, jwtSecret, {
      expiresIn: "1h",
    });
    return token;
  } catch (error) {
    console.log(error);
    throw new AppError("Invalid credentials", 401);
  }
}

module.exports = { registerService, loginService };
