import express from "express";
import validationMiddleware from "../../middleware/validationMiddleware";
import { authMiddleware } from "../../middleware/authMiddleware";
import { GetProductsDTO } from "./dto/get-products.dto";
import { ProductController } from "./product.controller";
import uploadMiddleware from "../../middleware/uploadMiddleware";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";

const router = express.Router();
const productController = new ProductController();

router.get(
  "/",
  authMiddleware,
  validationMiddleware(GetProductsDTO),
  productController.getProducts
);

router.get("/:id", authMiddleware, productController.getProduct);

router.post(
  "/",
  authMiddleware,
  uploadMiddleware,
  validationMiddleware(CreateProductDTO),
  productController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  uploadMiddleware,
  validationMiddleware(UpdateProductDTO),
  productController.updateProduct
);

router.delete("/:id", authMiddleware, productController.deleteProduct);

export default router;
