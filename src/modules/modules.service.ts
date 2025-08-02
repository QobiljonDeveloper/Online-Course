// src/modules/modules.service.ts
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
    const module = await this.prisma.module.create({
      data: {
        course_id: dto.course_id,
        title: dto.title,
      },
    });
    return this.map(module);
  }

  async findAll() {
    const modules = await this.prisma.module.findMany();
    return modules.map(this.map);
  }

  async findOne(id: number) {
    const module = await this.prisma.module.findUnique({ where: { id } });
    if (!module) throw new NotFoundException("Module not found");
    return this.map(module);
  }

  async update(id: number, dto: UpdateModuleDto) {
    if (dto.course_id !== undefined) {
      await this.ensureCourseExists(dto.course_id);
    }
    try {
      const updated = await this.prisma.module.update({
        where: { id },
        data: {
          ...(dto.course_id !== undefined ? { course_id: dto.course_id } : {}),
          ...(dto.title !== undefined ? { title: dto.title } : {}),
        },
      });
      return this.map(updated);
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

  private map(module: any) {
    return {
      id: module.id,
      course_id: module.course_id,
      title: module.title,
      createdAt: module.createdAt?.toISOString(),
      updatedAt: module.updatedAt?.toISOString(),
    };
  }
}
