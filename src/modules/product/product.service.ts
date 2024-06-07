import { Prisma, Product } from "@prisma/client";
import { GetProductsDTO } from "./dto/get-products.dto";
import { PaginationResponse } from "../pagination/types";
import { PaginationService } from "../pagination/pagination.service";
import PrismaService from "../prisma/prisma.service";
import { CreateProductDTO } from "./dto/create-product.dto";
import ApiError from "../../utils/ApiError";
import httpStatus from "http-status";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { FileService } from "../file/file.service";
import { HttpError } from "../../utils/HttpError";

export class ProductService {
  private paginationService: PaginationService;
  private prisma;
  private fileService: FileService;

  constructor() {
    this.paginationService = new PaginationService();
    this.prisma = PrismaService.getInstance();
    this.fileService = new FileService();
  }

  private async checkSkuProductDuplicate(sku: string): Promise<void> {
    const product = await this.prisma.product.findFirst({
      where: {
        sku,
      },
    });

    if (product) {
      throw new HttpError(
        `product with SKU ${sku} already exists`,
        httpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }

  async getProducts(
    getProductsDto: GetProductsDTO
  ): Promise<PaginationResponse<Product>> {
    const {
      page = 1,
      take = 10,
      sortBy = "id",
      sortOrder = "asc",
      search = "",
    } = getProductsDto;

    const validPage = Math.max(page, 1);
    const validTake = Math.max(take, 1);

    const whereClause: Prisma.ProductWhereInput = {
      name: {
        contains: search,
        mode: "insensitive",
      },
    };

    const [products, count] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: whereClause,
        include: {
          productCategory: true,
        },
        skip: (validPage - 1) * validTake,
        take: validTake,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.product.count({ where: whereClause }),
    ]);

    return {
      data: products,
      meta: this.paginationService.generateMeta({
        page: validPage,
        take: validTake,
        count,
      }),
    };
  }

  async getProduct(id: number): Promise<Product> {
    const product = await this.prisma.product.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        productCategory: true,
      },
    });

    return product;
  }

  async createProduct(
    createProductDTO: CreateProductDTO,
    image: string
  ): Promise<Product> {
    const { sku } = createProductDTO;

    await this.checkSkuProductDuplicate(sku);

    const newProduct = await this.prisma.product.create({
      data: {
        ...createProductDTO,
        image,
      },
    });

    return newProduct;
  }

  async updateProduct(
    id: number,
    updateProductDTO: UpdateProductDTO,
    image?: string
  ): Promise<Product> {
    const { sku } = updateProductDTO;

    const product = await this.prisma.product.findFirstOrThrow({
      where: { id },
    });

    if (product.sku !== sku) {
      await this.checkSkuProductDuplicate(sku || "");
    }

    if (image) {
      const imageToDelete = this.fileService.getFileNameFromUrl(product.image);
      this.fileService.deleteFile(imageToDelete);
    }

    const newProduct = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ...updateProductDTO,
        image: image || product.image,
      },
    });

    return newProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.prisma.product.findFirstOrThrow({
      where: { id },
    });

    const imageToDelete = this.fileService.getFileNameFromUrl(product.image);
    this.fileService.deleteFile(imageToDelete);

    await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
