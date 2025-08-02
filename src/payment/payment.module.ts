import { Module } from "@nestjs/common";
import { PaymentsService } from "./payment.service";
import { PaymentsController } from "./payment.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminsModule } from "../admins/admins.module";

@Module({
  imports: [PrismaModule, AdminsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentModule {}
