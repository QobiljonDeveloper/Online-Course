import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../../generated/prisma";

export class RegisterDto {
  @ApiProperty({ example: "Ali Valiyev" })
  @IsString()
  full_name: string;

  @ApiProperty({ example: "ali@mail.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "strongPassword123" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: Role, example: Role.USER, required: false })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
