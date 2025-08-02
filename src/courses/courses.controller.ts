// src/courses/courses.controller.ts
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
} from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import { IsTeacherGuard } from "../common/guards/isteacher.guard";
import { IsOwnCourseGuard } from "../common/guards/isOwnCourse.guard";

@ApiTags("Courses")
@Controller("courses")
export class CoursesController {
  private readonly logger = new Logger(CoursesController.name);

  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, IsTeacherGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Yangi kurs yaratish (faqat teacher)" })
  @ApiResponse({ status: 201, description: "Kurs yaratildi" })
  create(@Body() dto: CreateCourseDto) {
    this.logger.log("Creating course...");
    return this.coursesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha kurslarni olish" })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(":id")
  @ApiParam({ name: "id", type: Number })
  @ApiOperation({ summary: "ID bo‘yicha kursni olish" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, IsTeacherGuard, IsOwnCourseGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "O‘z kursini yangilash (faqat tegishli teacher)" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateCourseDto) {
    this.logger.log(`Updating course ${id}`);
    return this.coursesService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, IsTeacherGuard, IsOwnCourseGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "O‘z kursini o‘chirish (faqat tegishli teacher)" })
  remove(@Param("id", ParseIntPipe) id: number) {
    this.logger.log(`Deleting course ${id}`);
    return this.coursesService.remove(id);
  }
}
