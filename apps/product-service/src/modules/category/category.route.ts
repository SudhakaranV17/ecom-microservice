import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "./category.controller";
import { AccessControlMiddleware } from "../../middleware/Auth.middleware";

const router: Router = Router();

router.post("/", AccessControlMiddleware, createCategory);
router.put("/:id", AccessControlMiddleware, updateCategory);
router.delete("/:id", AccessControlMiddleware, deleteCategory);
router.get("/", getCategory);

export default router;
