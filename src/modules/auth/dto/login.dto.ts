import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
