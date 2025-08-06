import { IsOptional, IsString, IsBooleanString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FilterCourseDto {
  @ApiPropertyOptional({
    description: "Qidiruv (title yoki description)",
    example: "js",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: "Kategoriya ID", example: "1" })
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiPropertyOptional({ description: "Bepul kurslarmi", example: "true" })
  @IsOptional()
  @IsBooleanString()
  is_free?: string;

  @ApiPropertyOptional({ description: "Minimal narx", example: "10" })
  @IsOptional()
  @IsString()
  minPrice?: string;

  @ApiPropertyOptional({ description: "Maksimal narx", example: "100" })
  @IsOptional()
  @IsString()
  maxPrice?: string;

  @ApiPropertyOptional({ description: "Minimal reyting", example: "3" })
  @IsOptional()
  @IsString()
  minRating?: string;

  @ApiPropertyOptional({ description: "Maksimal reyting", example: "5" })
  @IsOptional()
  @IsString()
  maxRating?: string;
}
