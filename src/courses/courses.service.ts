// src/courses/courses.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureTeacherExists(teacher_id: number) {
    const teacher = await this.prisma.users.findUnique({
      where: { id: teacher_id },
    });
    if (!teacher || teacher.role !== "TEACHER") {
      throw new BadRequestException("Noto‘g‘ri o‘qituvchi ID");
    }
  }

  private async ensureCategoryExists(category_id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: category_id },
    });
    if (!category) {
      throw new BadRequestException("Noto‘g‘ri kategoriya ID");
    }
  }

  async create(dto: CreateCourseDto) {
    await this.ensureTeacherExists(dto.teacher_id);
    await this.ensureCategoryExists(dto.category_id);

    if (!dto.is_free) {
      if (!dto.price) throw new BadRequestException("Narx ko‘rsatilishi kerak");
    }

    return this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        course_image: dto.course_image ?? "",
        category_id: dto.category_id,
        teacher_id: dto.teacher_id,
        is_free: dto.is_free,
        price: dto.is_free ? "0.00" : dto.price,
      },
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        teacher: { select: { id: true, full_name: true, email: true } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        teacher: { select: { id: true, full_name: true, email: true } },
        category: true,
      },
    });
    if (!course) throw new NotFoundException("Kurs topilmadi");
    return course;
  }

  async update(id: number, dto: UpdateCourseDto) {
    const existing = await this.prisma.course.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Kurs topilmadi");

    if (dto.teacher_id) await this.ensureTeacherExists(dto.teacher_id);
    if (dto.category_id) await this.ensureCategoryExists(dto.category_id);

    if (dto.is_free === false && !dto.price) {
      throw new BadRequestException(
        "Narx ko‘rsatilishi kerak agar bepul emas bo‘lsa"
      );
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        ...dto,
        price: dto.is_free === true ? "0.00" : (dto.price ?? existing.price), // agar is_free true bo‘lsa 0.00
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // topilmas ekan, exception chiqadi
    return this.prisma.course.delete({ where: { id } });
  }
}
