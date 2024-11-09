import { Router } from "express";

import inventoryController from "../controllers/inventoryController.js";

const router = Router();

router.post("/adjustments", inventoryController.changeInventory);

export default router;
