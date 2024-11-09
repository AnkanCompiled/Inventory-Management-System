import { Router } from "express";

import customerController from "../controllers/customerController.js";

const router = Router();

router.get("/", customerController.getCustomer);
router.post("/", customerController.addCustomer);

export default router;
