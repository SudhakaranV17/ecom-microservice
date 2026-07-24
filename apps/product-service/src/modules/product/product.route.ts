import { Request, Response, Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./product.controller";
import { AccessControlMiddleware } from "../../middleware/Auth.middleware";

const router: Router = Router();

router.get("/test-product", (req: Request, res: Response) => {
  res.send("Product service is running");
});

router.post("/", AccessControlMiddleware, createProduct);
router.put("/:id", AccessControlMiddleware, updateProduct);
router.delete("/:id", AccessControlMiddleware, deleteProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;
