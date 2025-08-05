import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class CreatePrivateChatDto {
  @ApiProperty({ example: 1, description: "Birinchi foydalanuvchi ID" })
  @IsInt()
  @Min(1)
  user1_id: number;

  @ApiProperty({ example: 2, description: "Ikkinchi foydalanuvchi ID" })
  @IsInt()
  @Min(1)
  user2_id: number;

  @ApiProperty({ example: 5, description: "Kurs ID" })
  @IsInt()
  @Min(1)
  course_id: number;
}
