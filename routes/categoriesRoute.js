import { Router } from "express";
import authenticate from "../middlewares/auth.js";

import categoriesController from "../controllers/categoriesController.js";

const router = Router();

router.get("/:id", categoriesController.getCategory);
router.post("/", authenticate, categoriesController.addCategory);
router.delete("/:id", authenticate, categoriesController.deleteCategory);

export default router;
