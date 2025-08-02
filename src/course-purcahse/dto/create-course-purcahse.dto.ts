import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt } from "class-validator";
import { PurchaseStatus } from "../../../generated/prisma";

export class CreateCoursePurchaseDto {
  @ApiProperty({ example: 1, description: "Kurs ID" })
  @IsInt()
  course_id: number;

  @ApiProperty({ example: 5, description: "To'lov ID" })
  @IsInt()
  payment_id: number;

  @ApiProperty({ enum: PurchaseStatus, example: PurchaseStatus.COMPLETED })
  @IsEnum(PurchaseStatus)
  status: PurchaseStatus;
}
