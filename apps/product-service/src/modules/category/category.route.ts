import { Router } from "express";
import { createCategory, deleteCategory, getCategory, updateCategory } from "./category.controller";

const router:Router = Router();

router.post("/",createCategory);
router.put("/:id",updateCategory);
router.delete("/:id",deleteCategory);
router.get("/",getCategory)

export default router