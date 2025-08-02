import { IsOptional, IsBoolean } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class GetAdminNotificationsDto {
  @ApiPropertyOptional({
    description: "Faqat o‘qilmaganlarni olish",
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  unreadOnly?: boolean;
}
