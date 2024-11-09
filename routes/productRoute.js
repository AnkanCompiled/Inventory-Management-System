import { Router } from "express";
import authenticate from "../middlewares/auth.js";
import productController from "../controllers/productController.js";

const router = Router();

router.get("/", productController.getProduct);
router.get("/:id", productController.getProduct);
router.post("/", authenticate, productController.addProduct);
router.put("/:id", authenticate, productController.updateProduct);
router.delete("/:id", authenticate, productController.deleteProduct);

export default router;
