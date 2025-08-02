// src/auth/dto/create-admin.dto.ts
import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAdminDto {
  @ApiProperty({
    example: "Ali Valiev",
    description: "Adminning to‘liq ismi",
  })
  @IsString()
  full_name: string;

  @ApiProperty({
    example: "admin@example.com",
    description: "Adminning email manzili (unique bo‘lishi kerak)",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "strongPassword123",
    description: "Parol (kamida 6 ta belgidan iborat)",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
