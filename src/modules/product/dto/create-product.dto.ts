import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  sku!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  weight!: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  width!: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  height!: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  length!: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  price!: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  productCategoryId!: number;
}
