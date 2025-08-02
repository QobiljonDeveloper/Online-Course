import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNumber, Min } from "class-validator";
import { PaymentMethod } from "../../../generated/prisma";

export class CreatePaymentDto {
  @ApiProperty({ example: 1, description: "Kurs ID" })
  @IsInt()
  course_id: number;

  @ApiProperty({ example: 99.99, description: "To‘lov summasi" })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.PAYME })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;
}
