import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional } from "class-validator";

export class CreateCourseProgressDto {
  @ApiProperty({ example: 1, description: "Foydalanuvchi ID si" })
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 2, description: "Kurs ID si" })
  @IsInt()
  course_id: number;

  @ApiProperty({
    example: null,
    description: "Oxirgi tugatilgan dars ID si (agar yo‘q bo‘lsa null)",
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  last_lesson_id?: number | null;
}
