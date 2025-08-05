import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
  ParseIntPipe,
  NotFoundException,
} from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
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
import { IsTeacherOrAdminGuard } from "../common/guards/teacherOrAdmin.guard";

@ApiTags("Lessons")
@Controller("lessons")
export class LessonsController {
  private readonly logger = new Logger(LessonsController.name);

  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, IsTeacherOrAdminGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Yangi dars yaratish (autentifikatsiya talab qilinadi)",
  })
  @ApiCreatedResponse({
    description: "Dars yaratildi",
    schema: {
      example: {
        id: 10,
        video_url: "https://youtu.be/abc123",
        title: "Kirish",
        is_free: true,
        module_id: 5,
        createdAt: "2025-08-02T12:00:00.000Z",
        updatedAt: "2025-08-02T12:00:00.000Z",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Noto‘g‘ri ma'lumot yoki modul topilmadi",
  })
  @ApiUnauthorizedResponse({
    description: "Autentifikatsiya yo‘q yoki yaroqsiz",
  })
  async create(@Body() dto: CreateLessonDto) {
    this.logger.log("Creating lesson...");
    return this.lessonsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha darslarni olish" })
  @ApiOkResponse({
    description: "Darslar ro‘yxati",
    schema: {
      example: [
        {
          id: 10,
          video_url: "https://youtu.be/abc123",
          title: "Kirish",
          is_free: true,
          module_id: 5,
          createdAt: "2025-08-02T12:00:00.000Z",
          updatedAt: "2025-08-02T12:30:00.000Z",
        },
      ],
    },
  })
  async findAll() {
    return this.lessonsService.findAll();
  }

  @Get(":id")
  @ApiParam({ name: "id", type: Number })
  @ApiOperation({ summary: "ID bo‘yicha darsni olish" })
  @ApiOkResponse({
    description: "Topilgan dars",
    schema: {
      example: {
        id: 10,
        video_url: "https://youtu.be/abc123",
        title: "Kirish",
        is_free: true,
        module_id: 5,
        createdAt: "2025-08-02T12:00:00.000Z",
        updatedAt: "2025-08-02T12:30:00.000Z",
      },
    },
  })
  @ApiNotFoundResponse({ description: "Dars topilmadi" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const lesson = await this.lessonsService.findOne(id);
    if (!lesson) throw new NotFoundException("Lesson not found");
    return lesson;
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, IsTeacherOrAdminGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Darsni yangilash (autentifikatsiya talab qilinadi)",
  })
  @ApiOkResponse({
    description: "Dars yangilandi",
    schema: {
      example: {
        id: 10,
        video_url: "https://youtu.be/updated",
        title: "Kirish yangilangan",
        is_free: false,
        module_id: 5,
        createdAt: "2025-08-02T12:00:00.000Z",
        updatedAt: "2025-08-02T13:00:00.000Z",
      },
    },
  })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri ma'lumot yoki modul yo‘q" })
  @ApiUnauthorizedResponse({
    description: "Autentifikatsiya yo‘q yoki yaroqsiz",
  })
  @ApiNotFoundResponse({ description: "Dars topilmadi" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateLessonDto
  ) {
    this.logger.log(`Updating lesson ${id}`);
    const updated = await this.lessonsService.update(id, dto);
    if (!updated) throw new NotFoundException("Lesson not found");
    return updated;
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, IsTeacherOrAdminGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Darsni o‘chirish (autentifikatsiya talab qilinadi)",
  })
  @ApiOkResponse({
    description: "O‘chirildi",
    schema: { example: { success: true } },
  })
  @ApiUnauthorizedResponse({
    description: "Autentifikatsiya yo‘q yoki yaroqsiz",
  })
  @ApiNotFoundResponse({ description: "Dars topilmadi" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    this.logger.log(`Deleting lesson ${id}`);
    return this.lessonsService.remove(id);
  }
}
