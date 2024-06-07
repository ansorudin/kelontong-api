import { Transform } from "class-transformer";
import { IsString, IsOptional } from "class-validator";

export class UpdateProductDTO {
  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  weight?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  width?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  height?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  length?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  price?: number;
}
