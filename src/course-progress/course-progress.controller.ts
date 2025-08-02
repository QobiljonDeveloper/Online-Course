// src/course-progress/course-progress.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Logger,
  ParseIntPipe,
} from "@nestjs/common";
import { CourseProgressService } from "./course-progress.service";
import { CreateCourseProgressDto } from "./dto/create-course-progress.dto";
import { UpdateCourseProgressDto } from "./dto/update-course-progress.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";

@ApiTags("CourseProgress")
@Controller("course-progress")
export class CourseProgressController {
  private readonly logger = new Logger(CourseProgressController.name);

  constructor(private readonly courseProgressService: CourseProgressService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Yangi progress yaratish yoki yangilash" })
  @ApiCreatedResponse({
    description: "Progress yaratildi/yangilandi",
    schema: {
      example: {
        id: 7,
        user_id: 3,
        course_id: 2,
        completed_percentage: "40.00",
        last_lesson_id: 12,
        createdAt: "2025-08-02T12:00:00.000Z",
        updatedAt: "2025-08-02T12:30:00.000Z",
      },
    },
  })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri parametrlar" })
  @ApiUnauthorizedResponse({ description: "Autentifikatsiya talab qilinadi" })
  async create(@Body() dto: CreateCourseProgressDto) {
    this.logger.log("Creating/updating course progress...");
    return this.courseProgressService.create(dto);
  }

  @Get("user/:userId/course/:courseId")
  @ApiOperation({ summary: "Foydalanuvchi va kurs bo‘yicha progressni olish" })
  @ApiParam({ name: "userId", type: Number })
  @ApiParam({ name: "courseId", type: Number })
  @ApiOkResponse({
    description: "Progress ma'lumotlari",
    schema: {
      example: {
        id: 7,
        user_id: 3,
        course_id: 2,
        completed_percentage: "40.00",
        last_lesson_id: 12,
        createdAt: "2025-08-02T12:00:00.000Z",
        updatedAt: "2025-08-02T12:30:00.000Z",
      },
    },
  })
  @ApiNotFoundResponse({ description: "Progress topilmadi" })
  async findOne(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("courseId", ParseIntPipe) courseId: number
  ) {
    return this.courseProgressService.findOne(userId, courseId);
  }

  @Patch("user/:userId/course/:courseId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Progressni yangilash (masalan last_lesson_id)" })
  @ApiOkResponse({
    description: "Yangilangan progress",
    schema: {
      example: {
        id: 7,
        user_id: 3,
        course_id: 2,
        completed_percentage: "50.00",
        last_lesson_id: 13,
        createdAt: "2025-08-02T12:00:00.000Z",
        updatedAt: "2025-08-02T13:00:00.000Z",
      },
    },
  })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri ma'lumot" })
  @ApiUnauthorizedResponse({ description: "Autentifikatsiya yo‘q" })
  async update(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("courseId", ParseIntPipe) courseId: number,
    @Body() dto: UpdateCourseProgressDto
  ) {
    this.logger.log(
      `Updating course progress for user ${userId}, course ${courseId}`
    );
    return this.courseProgressService.update(userId, courseId, dto);
  }

  @Post("lesson-complete/:lessonId/user/:userId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Foydalanuvchi darsni tugatganda progressni belgilash",
  })
  @ApiCreatedResponse({
    description: "Dars tugatildi va progress yangilandi",
    schema: {
      example: {
        id: 7,
        user_id: 3,
        course_id: 2,
        completed_percentage: "60.00",
        last_lesson_id: 14,
        createdAt: "2025-08-02T12:00:00.000Z",
        updatedAt: "2025-08-02T13:30:00.000Z",
      },
    },
  })
  async markLessonCompleted(
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Param("userId", ParseIntPipe) userId: number
  ) {
    this.logger.log(`User ${userId} completed lesson ${lessonId}`);
    return this.courseProgressService.markLessonCompleted(userId, lessonId);
  }
}
