// src/lessons/lessons.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureModuleExists(moduleId: number) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
    });
    if (!module) {
      throw new BadRequestException("Associated module not found");
    }
  }

  async create(dto: CreateLessonDto) {
    await this.ensureModuleExists(dto.module_id);
    const lesson = await this.prisma.lesson.create({
      data: {
        video_url: dto.video_url,
        title: dto.title,
        is_free: dto.is_free,
        module_id: dto.module_id,
      },
    });
    return this.map(lesson);
  }

  async findAll() {
    const lessons = await this.prisma.lesson.findMany();
    return lessons.map(this.map);
  }

  async findOne(id: number) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException("Lesson not found");
    return this.map(lesson);
  }

  async update(id: number, dto: UpdateLessonDto) {
    if (dto.module_id !== undefined) {
      await this.ensureModuleExists(dto.module_id);
    }
    try {
      const updated = await this.prisma.lesson.update({
        where: { id },
        data: {
          ...(dto.video_url !== undefined ? { video_url: dto.video_url } : {}),
          ...(dto.title !== undefined ? { title: dto.title } : {}),
          ...(dto.is_free !== undefined ? { is_free: dto.is_free } : {}),
          ...(dto.module_id !== undefined ? { module_id: dto.module_id } : {}),
        },
      });
      return this.map(updated);
    } catch (e) {
      throw new NotFoundException("Lesson not found");
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.lesson.delete({ where: { id } });
      return { success: true };
    } catch (e) {
      throw new NotFoundException("Lesson not found");
    }
  }

  private map(lesson: any) {
    return {
      id: lesson.id,
      video_url: lesson.video_url,
      title: lesson.title,
      is_free: lesson.is_free,
      module_id: lesson.module_id,
      createdAt: lesson.createdAt?.toISOString(),
      updatedAt: lesson.updatedAt?.toISOString(),
    };
  }
}
