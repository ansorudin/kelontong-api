import { Prisma, Product, ProductCategory } from "@prisma/client";
import { PaginationResponse } from "../pagination/types";
import { PaginationService } from "../pagination/pagination.service";
import PrismaService from "../prisma/prisma.service";
import httpStatus from "http-status";
import { GetProductCategoriesDTO } from "./dto/get-product-categories.dto";
import { CreateProductCategoryDTO } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDTO } from "./dto/update-product-category.dto";
import { HttpError } from "../../utils/HttpError";

export class ProductCategoryService {
  private paginationService: PaginationService;
  private prisma;

  constructor() {
    this.paginationService = new PaginationService();
    this.prisma = PrismaService.getInstance();
  }

  private async checkNameProductCategoryDuplicate(name: string): Promise<void> {
    const productCategory = await this.prisma.productCategory.findFirst({
      where: {
        name,
      },
    });

    if (productCategory) {
      throw new HttpError(
        `product category with name ${name} already exists`,
        httpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }

  async getProductCategories(
    getProductCategories: GetProductCategoriesDTO
  ): Promise<PaginationResponse<ProductCategory>> {
    const {
      page = 1,
      take = 10,
      sortBy = "id",
      sortOrder = "asc",
      search = "",
    } = getProductCategories;

    const validPage = Math.max(page, 1);
    const validTake = Math.max(take, 1);

    const whereClause: Prisma.ProductCategoryWhereInput = {
      name: {
        contains: search,
        mode: "insensitive",
      },
    };

    const [productCategories, count] = await this.prisma.$transaction([
      this.prisma.productCategory.findMany({
        where: whereClause,
        skip: (validPage - 1) * validTake,
        take: validTake,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.productCategory.count({ where: whereClause }),
    ]);

    return {
      data: productCategories,
      meta: this.paginationService.generateMeta({
        page: validPage,
        take: validTake,
        count,
      }),
    };
  }

  async getProductCategory(id: number): Promise<ProductCategory> {
    const productCategory = await this.prisma.productCategory.findFirstOrThrow({
      where: {
        id,
      },
    });

    return productCategory;
  }

  async createProductCategory(
    createProductCategoryDTO: CreateProductCategoryDTO
  ): Promise<ProductCategory> {
    const { name } = createProductCategoryDTO;

    await this.checkNameProductCategoryDuplicate(name);

    const newProductCategory = await this.prisma.productCategory.create({
      data: {
        ...createProductCategoryDTO,
      },
    });

    return newProductCategory;
  }

  async updateProductCategory(
    updateProductCategoryDTO: UpdateProductCategoryDTO,
    id: number
  ): Promise<ProductCategory> {
    const { name } = updateProductCategoryDTO;

    await this.prisma.productCategory.findFirstOrThrow({
      where: {
        id,
      },
    });

    await this.checkNameProductCategoryDuplicate(name || "");

    const newProductCategory = await this.prisma.productCategory.update({
      where: {
        id,
      },
      data: updateProductCategoryDTO,
    });

    return newProductCategory;
  }

  async deleteProductCategory(id: number): Promise<void> {
    await this.prisma.productCategory.findFirstOrThrow({
      where: {
        id,
      },
    });

    await this.prisma.productCategory.delete({
      where: {
        id,
      },
    });
  }
}
