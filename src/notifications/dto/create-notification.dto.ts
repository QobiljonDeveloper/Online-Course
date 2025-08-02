import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsBoolean, IsInt } from "class-validator";

export class CreateNotificationDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  user_id?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  admin_id?: number;

  @ApiProperty({ example: "Yangi xabar" })
  @IsString()
  title: string;

  @ApiProperty({ example: "Sizga yangi bildirishnoma bor" })
  @IsString()
  message: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  read: boolean;
}
