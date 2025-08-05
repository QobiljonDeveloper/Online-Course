import { Module } from "@nestjs/common";
import { ModulesService } from "./modules.service";
import { ModulesController } from "./modules.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminsModule } from "../admins/admins.module";

@Module({
  imports: [PrismaModule, AdminsModule],

  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}
