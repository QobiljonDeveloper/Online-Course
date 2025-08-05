import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateGroupDto {
  @ApiProperty({ example: 1, description: "Course ID" })
  @IsInt()
  courseId: number;

  @ApiProperty({ example: "Frontend Bootcamp", description: "Group name" })
  @IsString()
  @IsNotEmpty()
  groupName: string;
}
