import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { PaymentStatus } from "../../../generated/prisma";

export class UpdatePaymentStatusDto {
  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.SUCCEEDED })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
