import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateModuleDto } from "./dto/create-module.dto";
import { UpdateModuleDto } from "./dto/update-module.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ModulesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureCourseExists(courseId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new BadRequestException("Associated course not found");
    }
  }

  async create(dto: CreateModuleDto) {
    await this.ensureCourseExists(dto.course_id);

    const existing = await this.prisma.module.findFirst({
      where: {
        course_id: dto.course_id,
        title: dto.title,
      },
    });

    if (existing) {
      throw new BadRequestException(
        "Bunday nom bilan module allaqachon mavjud"
      );
    }

    return this.prisma.module.create({
      data: {
        course_id: dto.course_id,
        title: dto.title,
      },
      select: {
        id: true,
        course_id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.module.findMany({
      select: {
        id: true,
        course_id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const module = await this.prisma.module.findUnique({
      where: { id },
      select: {
        id: true,
        course_id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!module) throw new NotFoundException("Module not found");
    return module;
  }

  async update(id: number, dto: UpdateModuleDto) {
    if (dto.course_id !== undefined) {
      await this.ensureCourseExists(dto.course_id);
    }

    try {
      return await this.prisma.module.update({
        where: { id },
        data: {
          ...(dto.course_id !== undefined ? { course_id: dto.course_id } : {}),
          ...(dto.title !== undefined ? { title: dto.title } : {}),
        },
        select: {
          id: true,
          course_id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (e) {
      throw new NotFoundException("Module not found");
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.module.delete({ where: { id } });
      return { success: true };
    } catch (e) {
      throw new NotFoundException("Module not found");
    }
  }
}
