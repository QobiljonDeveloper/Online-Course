// src/lesson-progress/lesson-progress.controller.ts
import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Logger,
  Get,
  Body,
} from "@nestjs/common";

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiParam,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import { LessonProgressService } from "./lesson_progress.service";
import { CreateLessonProgressDto } from "./dto/create-lesson_progress.dto";

@ApiTags("LessonProgress")
@Controller("lesson-progress")
export class LessonProgressController {
  private readonly logger = new Logger(LessonProgressController.name);

  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @Post("complete")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Darsni tugatish va kurs progressini yangilash" })
  @ApiCreatedResponse({
    description: "Dars tugatildi va kurs progressi yangilandi",
    schema: {
      example: {
        id: 1,
        user_id: 3,
        course_id: 2,
        completed_percentage: 60,
        last_lesson_id: 15,
        createdAt: "2025-08-02T12:00:00.000Z",
        updatedAt: "2025-08-02T12:10:00.000Z",
      },
    },
  })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri ma'lumot" })
  @ApiUnauthorizedResponse({ description: "Token yo‘q yoki noto‘g‘ri" })
  async completeLesson(@Body() dto: CreateLessonProgressDto) {
    this.logger.log(`User ${dto.user_id} completed lesson ${dto.lesson_id}`);
    return this.lessonProgressService.markCompleted(dto.user_id, dto.lesson_id);
  }

  @Delete(":userId/:lessonId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Tugatilgan darsni o‘chirish va kurs progressini yangilash",
  })
  @ApiOkResponse({
    description: "Dars o‘chirildi va kurs progressi yangilandi",
    schema: { example: { success: true } },
  })
  @ApiNotFoundResponse({ description: "LessonProgress topilmadi" })
  async remove(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("lessonId", ParseIntPipe) lessonId: number
  ) {
    this.logger.log(`Removing completed lesson ${lessonId} for user ${userId}`);
    return this.lessonProgressService.remove(userId, lessonId);
  }

  @Get("completed/:userId/:courseId")
  @ApiOperation({
    summary: "Foydalanuvchining kurs bo‘yicha tugatilgan darslari",
  })
  @ApiParam({ name: "userId", type: Number })
  @ApiParam({ name: "courseId", type: Number })
  @ApiOkResponse({ description: "Tugatilgan darslar ro‘yxati" })
  async completedLessons(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("courseId", ParseIntPipe) courseId: number
  ) {
    return this.lessonProgressService.findCompletedLessons(userId, courseId);
  }
}
