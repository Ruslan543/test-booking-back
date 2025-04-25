import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: "Password cannot be less than 8 characters!",
  })
  password: string;
}
