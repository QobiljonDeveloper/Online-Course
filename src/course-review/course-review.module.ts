import { Module } from "@nestjs/common";
import { CourseReviewService } from "./course-review.service";
import { CourseReviewController } from "./course-review.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CourseReviewController],
  providers: [CourseReviewService],
})
export class CourseReviewModule {}
