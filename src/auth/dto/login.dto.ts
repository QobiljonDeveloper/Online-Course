import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "ali@mail.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "strongPassword123" })
  @IsString()
  @MinLength(6)
  password: string;
}
