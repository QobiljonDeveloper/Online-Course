import {
  IsEmail,
  IsString,
  MinLength,
  IsBoolean,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAdminDto {
  @ApiProperty({
    example: "Ali Valiyev",
    description: "Adminning to‘liq ismi",
    maxLength: 60,
  })
  @IsString()
  full_name: string;

  @ApiProperty({
    example: "admin@example.com",
    description: "Admin email manzili (unique)",
    maxLength: 50,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "StrongPass123",
    description: "Parol (kamida 6 ta belgi)",
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: false,
    description: 'Yaratilgan admin "creator"mi',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_creator?: boolean;
  @ApiProperty({
    example: "refresh-token-value",
    description: "Refresh token",
  })
  @IsString()
  refresh_token: string;
}
