import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MinLength, MaxLength } from "class-validator";

export class CreateModuleDto {
  @ApiProperty({ example: 1, description: "Qaysi kursga tegishli" })
  @IsInt()
  course_id: number;

  @ApiProperty({ example: "Kirish", description: "Modul sarlavhasi" })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;
}
