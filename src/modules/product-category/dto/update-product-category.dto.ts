import { IsString, IsOptional } from "class-validator";

export class UpdateProductCategoryDTO {
  @IsOptional()
  @IsString()
  name?: string;
}
