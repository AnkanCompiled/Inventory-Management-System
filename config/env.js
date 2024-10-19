module.exports = {
  Port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "secretKey",
};
