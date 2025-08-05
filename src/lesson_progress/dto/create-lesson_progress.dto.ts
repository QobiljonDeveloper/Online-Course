import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class CreateLessonProgressDto {
  @ApiProperty({ example: 10, description: "Tugatgan dars (lesson) ID si" })
  @IsInt()
  lesson_id: number;

  @ApiProperty({ example: 3, description: "Foydalanuvchi ID si" })
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 3, description: "Course ID si" })
  @IsInt()
  course_id: number;
}
