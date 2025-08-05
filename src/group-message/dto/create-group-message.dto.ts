import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateGroupMessageDto {
  @ApiProperty({ example: 1, description: "Group ID" })
  @IsInt()
  groupId: number;

  @ApiProperty({ example: 2, description: "Sender user ID" })
  @IsInt()
  senderId: number;

  @ApiProperty({ example: "Hello everyone!", description: "Message content" })
  @IsString()
  @IsNotEmpty()
  content: string;
}
