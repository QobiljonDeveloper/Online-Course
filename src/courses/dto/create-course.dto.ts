import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsInt,
  IsDecimal,
  ValidateIf,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateCourseDto {
  @ApiProperty({ example: "JavaScript asoslari" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: "Bu kurs JavaScriptni boshidan o‘rgatadi" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: "Kurs rasmi (URL yoki path)",
    example: "https://example.com/images/js.png",
  })
  @IsOptional()
  @IsString()
  course_image?: string;

  @ApiProperty({ example: 1, description: "Category ID" })
  @Type(() => Number)
  @IsInt()
  category_id: number;

  @ApiProperty({ example: 42, description: "Teacher (user) ID" })
  @Type(() => Number)
  @IsInt()
  teacher_id: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  is_free: boolean;

  @ApiPropertyOptional({
    example: "0.00",
    description: "Agar is_free=false bo‘lsa, narx",
  })
  @ValidateIf((o) => o.is_free === false)
  @IsOptional()
  @IsString()
  price: string;
}
