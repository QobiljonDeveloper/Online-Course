import { Module } from "@nestjs/common";
import { GroupsService } from "./group.service";
import { GroupsController } from "./group.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminsModule } from "../admins/admins.module";

@Module({
  imports: [PrismaModule, AdminsModule],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupModule {}
