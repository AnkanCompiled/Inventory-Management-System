import { Router } from "express";
import authenticate from "../middlewares/auth.js";

import transactionsController from "../controllers/transactionsController.js";

const router = Router();

router.get("/", authenticate, transactionsController.getTransaction);
router.post("/", transactionsController.addTransaction);

export default router;
