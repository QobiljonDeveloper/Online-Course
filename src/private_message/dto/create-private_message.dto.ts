import { IsInt, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePrivateMessageDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  privateChatId: number;

  @ApiProperty({ example: "Salom, xush kelibsiz!" })
  @IsString()
  @MinLength(1)
  content: string;
}
