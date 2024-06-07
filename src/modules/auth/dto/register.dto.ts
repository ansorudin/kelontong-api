import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;
}
