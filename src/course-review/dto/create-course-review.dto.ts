import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min, Max, IsString, MaxLength } from "class-validator";

export class CreateCourseReviewDto {
  @ApiProperty({ example: 1, description: "Kurs ID" })
  @IsInt()
  course_id: number;

  @ApiProperty({ example: 5, description: "Baholash (1-5)" })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: "Juda foydali kurs", description: "Sharh matni" })
  @IsString()
  @MaxLength(1000)
  comment: string;
}
