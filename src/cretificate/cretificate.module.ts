import { Module } from "@nestjs/common";
import { CertificateService } from "./cretificate.service";
import { PrismaModule } from "../prisma/prisma.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { CertificateController } from "./cretificate.controller";
import { AdminsModule } from "../admins/admins.module";

@Module({
  imports: [PrismaModule, NotificationsModule, AdminsModule],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CretificateModule {}
