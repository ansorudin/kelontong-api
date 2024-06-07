import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import { GetProductsDTO } from "./dto/get-products.dto";
import { FileService } from "../file/file.service";
import ApiError from "../../utils/ApiError";
import httpStatus from "http-status";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";

export class ProductController {
  private productService: ProductService;
  private fileService: FileService;

  constructor() {
    this.productService = new ProductService();
    this.fileService = new FileService();
  }

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: GetProductsDTO = req.query as unknown as GetProductsDTO;
      const products = await this.productService.getProducts(query);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const products = await this.productService.getProduct(Number(id));
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      const body: CreateProductDTO = req.body as CreateProductDTO;

      if (!file) {
        throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, "no file uploaded");
      }

      const fileUrl = this.fileService.getFileUrl(file.filename);
      const products = await this.productService.createProduct(body, fileUrl);
      res.status(201).json(products);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const file = req.file;
      const body: UpdateProductDTO = req.body as UpdateProductDTO;

      let fileUrl: string | undefined;

      if (file) {
        fileUrl = this.fileService.getFileUrl(file.filename);
      }

      const products = await this.productService.updateProduct(
        Number(id),
        body,
        fileUrl
      );
      res.status(201).json(products);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await this.productService.deleteProduct(Number(id));
      res.status(201).send({
        message: "Delete product has been successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
