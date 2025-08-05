import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateLessonDto {
  @ApiProperty({
    example: "https://youtu.be/abc123",
    description: "Video manzili (URL)",
  })
  @IsString()
  @IsUrl()
  @MaxLength(1000)
  video_url: string;

  @ApiProperty({ example: "Kirish darsi", description: "Dars nomi" })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: true, description: "Bepulmi yoki yo‘q" })
  @IsBoolean()
  is_free: boolean;

  @ApiProperty({
    example: 5,
    description: "Qaysi modulga tegishli (module_id)",
  })
  @IsInt()
  module_id: number;
}
