import { Module } from "@nestjs/common";
import { CoursePurchaseService } from "./course-purcahse.service";
import { CoursePurchaseController } from "./course-purcahse.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CoursePurchaseController],
  providers: [CoursePurchaseService],
})
export class CoursePurcahseModule {}
