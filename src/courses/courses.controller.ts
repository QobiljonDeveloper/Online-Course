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
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import { IsTeacherGuard } from "../common/guards/isteacher.guard";
import { IsOwnCourseGuard } from "../common/guards/isOwnCourse.guard";
import { IsAdminGuard } from "../common/guards/isAdmin.guard";
import { IsTeacherOrAdminGuard } from "../common/guards/teacherOrAdmin.guard";

@ApiTags("Courses")
@Controller("courses")
export class CoursesController {
  private readonly logger = new Logger(CoursesController.name);

  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, IsTeacherOrAdminGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Yangi kurs yaratish (faqat teacher)" })
  @ApiCreatedResponse({ description: "Kurs yaratildi" })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri ma'lumot" })
  @ApiUnauthorizedResponse({
    description: "Autentifikatsiya yo‘q yoki yaroqsiz",
  })
  @ApiForbiddenResponse({ description: "Teacher bo‘lmagan foydalanuvchi" })
  async create(@Body() dto: CreateCourseDto) {
    this.logger.log("Creating course...");
    return this.coursesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha kurslarni olish" })
  @ApiOkResponse({ description: "Kurslar ro‘yxati" })
  async findAll() {
    return this.coursesService.findAll();
  }

  @Get(":id")
  @ApiParam({ name: "id", type: Number })
  @ApiOperation({ summary: "ID bo‘yicha kursni olish" })
  @ApiOkResponse({ description: "Kurs topildi" })
  @ApiNotFoundResponse({ description: "Kurs topilmadi" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const course = await this.coursesService.findOne(id);
    if (!course) {
      throw new NotFoundException("Course not found");
    }
    return course;
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, IsTeacherGuard, IsOwnCourseGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "O‘z kursini yangilash (faqat tegishli teacher)" })
  @ApiOkResponse({ description: "Kurs yangilandi" })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri ma'lumot" })
  @ApiUnauthorizedResponse({
    description: "Autentifikatsiya yo‘q yoki yaroqsiz",
  })
  @ApiForbiddenResponse({ description: "Ruxsat yo‘q" })
  @ApiNotFoundResponse({ description: "Kurs topilmadi" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCourseDto
  ) {
    this.logger.log(`Updating course ${id}`);
    const updated = await this.coursesService.update(id, dto);
    if (!updated) {
      throw new NotFoundException("Course not found");
    }
    return updated;
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, IsTeacherGuard, IsOwnCourseGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "O‘z kursini o‘chirish (faqat tegishli teacher)" })
  @ApiOkResponse({ description: "Kurs o‘chirildi" })
  @ApiUnauthorizedResponse({
    description: "Autentifikatsiya yo‘q yoki yaroqsiz",
  })
  @ApiForbiddenResponse({ description: "Ruxsat yo‘q" })
  @ApiNotFoundResponse({ description: "Kurs topilmadi" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    this.logger.log(`Deleting course ${id}`);
    const deleted = await this.coursesService.remove(id);
    if (!deleted) {
      throw new NotFoundException("Course not found");
    }
    return { success: true };
  }
}
