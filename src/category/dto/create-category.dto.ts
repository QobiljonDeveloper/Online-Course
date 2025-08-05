import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: "Frontend", description: "Kategoriya nomi" })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: "Web dasturlashga oid kurslar",
    description: "Kategoriya ta'rifi",
  })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  description: string;
}
