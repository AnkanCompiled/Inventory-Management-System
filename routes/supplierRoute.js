import { Router } from "express";
import authenticate from "../middlewares/auth.js";
import supplierController from "../controllers/supplierController.js";

const router = Router();

router.get("/", supplierController.getSupplier);
router.post("/", authenticate, supplierController.addSupplier);

export default router;
