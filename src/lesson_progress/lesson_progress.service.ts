import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LessonProgressService {
  constructor(private readonly prisma: PrismaService) {}

  private async recalcCourseProgress(
    userId: number,
    courseId: number,
    lastLessonId: number | null
  ) {
    const totalLessons = await this.prisma.lesson.count({
      where: { module: { course_id: courseId } },
    });

    const completedLessons = await this.prisma.lessonProgress.count({
      where: {
        user_id: userId,
        lesson: { module: { course_id: courseId } },
      },
    });

    const completedPercentage =
      totalLessons === 0
        ? 0
        : Number(((completedLessons / totalLessons) * 100).toFixed(2));

    return this.prisma.courseProgress.upsert({
      where: { user_id_course_id: { user_id: userId, course_id: courseId } },
      create: {
        user_id: userId,
        course_id: courseId,
        completed_percentage: completedPercentage,
        last_lesson_id: lastLessonId,
      },
      update: {
        completed_percentage: completedPercentage,
        last_lesson_id: lastLessonId,
      },
    });
  }

  async markCompleted(userId: number, lessonId: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });
    if (!lesson) throw new BadRequestException("Lesson not found");

    await this.prisma.lessonProgress.upsert({
      where: { user_id_lesson_id: { user_id: userId, lesson_id: lessonId } },
      create: { user_id: userId, lesson_id: lessonId },
      update: { completedAt: new Date() },
    });

    return this.recalcCourseProgress(userId, lesson.module.course_id, lessonId);
  }

  async remove(userId: number, lessonId: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });
    if (!lesson) throw new BadRequestException("Lesson not found");

    try {
      await this.prisma.lessonProgress.delete({
        where: { user_id_lesson_id: { user_id: userId, lesson_id: lessonId } },
      });
    } catch {
      throw new NotFoundException("LessonProgress not found");
    }

    return this.recalcCourseProgress(userId, lesson.module.course_id, null);
  }

  async findCompletedLessons(userId: number, courseId: number) {
    return this.prisma.lessonProgress.findMany({
      where: {
        user_id: userId,
        lesson: { module: { course_id: courseId } },
      },
      include: { lesson: true },
    });
  }
}
