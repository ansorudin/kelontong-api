import { Request, Response, NextFunction } from "express";
import { ProductCategoryService } from "./product-category.service";
import { GetProductCategoriesDTO } from "./dto/get-product-categories.dto";
import { CreateProductCategoryDTO } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDTO } from "./dto/update-product-category.dto";

export class ProductCategoryController {
  private productCategoryService: ProductCategoryService;

  constructor() {
    this.productCategoryService = new ProductCategoryService();
  }

  getProductCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query: GetProductCategoriesDTO =
        req.query as unknown as GetProductCategoriesDTO;
      const productCategories =
        await this.productCategoryService.getProductCategories(query);
      res.status(200).json(productCategories);
    } catch (error) {
      next(error);
    }
  };

  getProductCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const productCategory =
        await this.productCategoryService.getProductCategory(Number(id));
      res.status(200).json(productCategory);
    } catch (error) {
      next(error);
    }
  };

  createProductCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body: CreateProductCategoryDTO =
        req.body as CreateProductCategoryDTO;

      const productCategory =
        await this.productCategoryService.createProductCategory(body);
      res.status(201).json(productCategory);
    } catch (error) {
      next(error);
    }
  };

  updateProductCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const body: UpdateProductCategoryDTO =
        req.body as UpdateProductCategoryDTO;

      const productCategory =
        await this.productCategoryService.updateProductCategory(
          body,
          Number(id)
        );
      res.status(201).json(productCategory);
    } catch (error) {
      next(error);
    }
  };

  deleteProductCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      await this.productCategoryService.deleteProductCategory(Number(id));

      res.status(201).send({
        message: "Delete product category successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
