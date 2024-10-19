const { registerService, loginService } = require("../services/userService");

async function registerUser(req, res, next) {
  try {
    const userId = await registerService(
      req.body.username,
      req.body.password,
      req.body.role,
      req.body.email,
      req.body.fullname
    );
    res.status(201).json({
      message: "User registered successfully",
      userId: userId,
    });
  } catch (err) {
    next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    const user = await loginService(req.body.username, req.body.password);
    res.status(200).json({
      message: "User login successfully",
      token: user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { registerUser, loginUser };
