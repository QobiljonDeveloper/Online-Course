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
    return this.prisma.lesson.create({
      data: {
        video_url: dto.video_url,
        title: dto.title,
        is_free: dto.is_free,
        module_id: dto.module_id,
      },
      select: {
        id: true,
        video_url: true,
        title: true,
        is_free: true,
        module_id: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.lesson.findMany({
      select: {
        id: true,
        video_url: true,
        title: true,
        is_free: true,
        module_id: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      select: {
        id: true,
        video_url: true,
        title: true,
        is_free: true,
        module_id: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!lesson) throw new NotFoundException("Lesson not found");
    return lesson;
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
        select: {
          id: true,
          video_url: true,
          title: true,
          is_free: true,
          module_id: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updated;
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
}
