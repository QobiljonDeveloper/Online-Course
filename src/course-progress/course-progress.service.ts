// src/course-progress/course-progress.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateCourseProgressDto } from "./dto/create-course-progress.dto";
import { UpdateCourseProgressDto } from "./dto/update-course-progress.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CourseProgressService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper: kursdagi jami darslar soni
  private async totalLessonsForCourse(courseId: number): Promise<number> {
    return this.prisma.lesson.count({
      where: { module: { course_id: courseId } },
    });
  }

  // Helper: foydalanuvchi qaysi darslarni tugatganligi shu kurs bo'yicha
  private async completedLessonsCount(
    userId: number,
    courseId: number
  ): Promise<number> {
    return this.prisma.lessonProgress.count({
      where: {
        user_id: userId,
        lesson: {
          module: {
            course_id: courseId,
          },
        },
      },
    });
  }

  // Progressni qayta hisoblash va saqlash (yoki yangilash)
  private async recalcAndUpsertProgress(
    userId: number,
    courseId: number,
    lastLessonId: number | null
  ) {
    // tekshir: user, course mavjudligini oling
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException("User not found");

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new BadRequestException("Course not found");

    if (lastLessonId !== null && lastLessonId !== undefined) {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lastLessonId },
      });
      if (!lesson) throw new BadRequestException("Last lesson not found");
    }

    const totalLessons = await this.totalLessonsForCourse(courseId);
    const completed = await this.completedLessonsCount(userId, courseId);

    const completedPercentage =
      totalLessons === 0
        ? 0
        : Number(((completed / totalLessons) * 100).toFixed(2));

    const data: any = {
      user_id: userId,
      course_id: courseId,
      completed_percentage: completedPercentage,
      last_lesson_id: lastLessonId ?? null,
    };

    const upserted = await this.prisma.courseProgress.upsert({
      where: { user_id_course_id: { user_id: userId, course_id: courseId } },
      create: data,
      update: data,
    });

    return upserted;
  }

  async create(dto: CreateCourseProgressDto) {
    return this.recalcAndUpsertProgress(
      dto.user_id,
      dto.course_id,
      dto.last_lesson_id ?? null
    );
  }

  async findOne(userId: number, courseId: number) {
    const progress = await this.prisma.courseProgress.findUnique({
      where: { user_id_course_id: { user_id: userId, course_id: courseId } },
    });
    if (!progress) throw new NotFoundException("CourseProgress not found");
    return progress;
  }

  async update(userId: number, courseId: number, dto: UpdateCourseProgressDto) {
    // agar last_lesson_id o'zgargan bo'lsa yoki qayta hisoblashni istasak
    return this.recalcAndUpsertProgress(
      userId,
      courseId,
      dto.last_lesson_id !== undefined ? dto.last_lesson_id : null
    );
  }

  // Foydalanuvchi darsni tugatganda: lessonProgress yaratib, progressni yangilash
  async markLessonCompleted(userId: number, lessonId: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });
    if (!lesson) throw new BadRequestException("Lesson not found");

    const courseId = lesson.module.course_id;

    await this.prisma.lessonProgress.upsert({
      where: { user_id_lesson_id: { user_id: userId, lesson_id: lessonId } },
      create: { user_id: userId, lesson_id: lessonId },
      update: { completedAt: new Date() },
    });

    // oxirgi darsni yangilab progressni qayta hisoblash
    return this.recalcAndUpsertProgress(userId, courseId, lessonId);
  }
}
