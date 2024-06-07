import { IsString, IsNotEmpty } from "class-validator";

export class CreateProductCategoryDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
