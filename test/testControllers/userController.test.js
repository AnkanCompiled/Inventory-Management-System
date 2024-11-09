import { expect } from "chai";
import { stub, restore, spy } from "sinon";
import AppError from "../../errors/AppError.js";
import userController from "../../controllers/userController.js";
import userService from "../../services/userService.js";

describe("User Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: stub().returnsThis(),
      json: stub(),
    };
    next = stub();
  });

  afterEach(() => {
    restore();
  });

  describe("register user", () => {
    it("should register an user and return status 201", async () => {
      req.body = {
        username: "ankanname",
        password: "ankan123",
        role: "admin",
        email: "ankanemail@gmail.com",
        fullname: "Ankan Biswas",
      };

      stub(userService, "registerService").resolves(1);

      await userController.registerUser(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
    });
    it("next should give error", async () => {
      req.body = {};
      const next = spy();
      const error = new AppError("Registration failed", 400);

      stub(userService, "registerService").throws(error);

      await userController.registerUser(req, res, next);
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe("login user", () => {
    it("should login an user and return status 200", async () => {
      req.body = {
        username: "ankanname",
        password: "ankan123",
      };

      stub(userService, "loginService").resolves("token");

      await userController.loginUser(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
    });
  });
});
