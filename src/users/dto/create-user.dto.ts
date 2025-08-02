import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../../generated/prisma";

export class CreateUserDto {
  @ApiProperty({
    example: "Ali Valiyev",
    description: "Foydalanuvchi to‘liq ismi",
  })
  @IsString()
  full_name: string;

  @ApiProperty({ example: "ali@gmail.com", description: "Email manzili" })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "strongPassword123",
    description: "Parol (kamida 6 belgidan iborat)",
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: Role,
    example: Role.USER,
    description: "Foydalanuvchi roli",
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    example: "some-unique-activation-link",
    description: "Aktivatsiya havolasi",
  })
  @IsString()
  activation_link: string;

  @ApiProperty({
    example: "refresh-token-value",
    description: "Refresh token",
  })
  @IsString()
  refresh_token: string;
}
