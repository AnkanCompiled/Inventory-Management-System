import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env.js";
import AppError from "../errors/AppError.js";

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new AppError("Please login to access this route", 401));
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return next(new AppError("Invalid token", 401));
    }
    req.user = decoded.user[0];
    if (req.user.role !== "admin") {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  });
};

export default authenticate;
