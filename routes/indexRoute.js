import { Router } from "express";

import userController from "../controllers/userController.js";
import customerRoute from "./customerRoute.js";
import productRoute from "./productRoute.js";
import supplierRoute from "./supplierRoute.js";
import categoriesRoute from "./categoriesRoute.js";
import transactionsRoute from "./transactionRoute.js";
import inventoryRoute from "./inventoryRoute.js";

const router = Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.use("/products", productRoute);
router.use("/customers", customerRoute);
router.use("/suppliers", supplierRoute);
router.use("/categories", categoriesRoute);
router.use("/transactions", transactionsRoute);
router.use("/inventory", inventoryRoute);

export default router;
