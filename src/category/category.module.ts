import { Module } from "@nestjs/common";
import { CategoriesService } from "./category.service";
import { CategoriesController } from "./category.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminsModule } from "../admins/admins.module";

@Module({
  imports: [PrismaModule, AdminsModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoryModule {}
