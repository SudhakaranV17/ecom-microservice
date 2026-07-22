import { Request, Response, Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "./product.controller";

const router: Router = Router();

router.get("/test-product", (req: Request, res: Response) => {
  res.send("Product service is running");
});

router.post("/",createProduct);
router.put("/:id",updateProduct);
router.delete("/:id",deleteProduct);
router.get("/",getProducts);
router.get("/:id",getProductById);

export default router;