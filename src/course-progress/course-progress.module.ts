import { Module } from "@nestjs/common";
import { CourseProgressService } from "./course-progress.service";
import { CourseProgressController } from "./course-progress.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminsModule } from "../admins/admins.module";

@Module({
  imports: [PrismaModule, AdminsModule],
  controllers: [CourseProgressController],
  providers: [CourseProgressService],
})
export class CourseProgressModule {}
