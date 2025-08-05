import { Module } from "@nestjs/common";
import { PrivateChatService } from "./private_chat.service";
import { PrivateChatController } from "./private_chat.controller";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminsModule } from "../admins/admins.module";

@Module({
  imports: [PrismaModule, AdminsModule],
  controllers: [PrivateChatController],
  providers: [PrivateChatService],
})
export class PrivateChatModule {}
