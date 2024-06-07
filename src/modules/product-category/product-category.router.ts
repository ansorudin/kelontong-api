import express from "express";
import validationMiddleware from "../../middleware/validationMiddleware";
import { authMiddleware } from "../../middleware/authMiddleware";
import uploadMiddleware from "../../middleware/uploadMiddleware";
import { ProductCategoryController } from "./product-category.controller";
import { GetProductCategoriesDTO } from "./dto/get-product-categories.dto";
import { CreateProductCategoryDTO } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDTO } from "./dto/update-product-category.dto";

const router = express.Router();
const productCategoryController = new ProductCategoryController();

router.get(
  "/",
  authMiddleware,
  validationMiddleware(GetProductCategoriesDTO),
  productCategoryController.getProductCategories
);

router.get(
  "/:id",
  authMiddleware,
  productCategoryController.getProductCategory
);

router.post(
  "/",
  authMiddleware,
  uploadMiddleware,
  validationMiddleware(CreateProductCategoryDTO),
  productCategoryController.createProductCategory
);

router.put(
  "/:id",
  authMiddleware,
  uploadMiddleware,
  validationMiddleware(UpdateProductCategoryDTO),
  productCategoryController.updateProductCategory
);

router.delete(
  "/:id",
  authMiddleware,
  uploadMiddleware,
  productCategoryController.deleteProductCategory
);

export default router;
