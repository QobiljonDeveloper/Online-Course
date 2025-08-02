import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCourseReviewDto } from "./dto/create-course-review.dto";
import { UpdateCourseReviewDto } from "./dto/update-course-review.dto";

@Injectable()
export class CourseReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateCourseReviewDto) {
    const existing = await this.prisma.courseReview.findUnique({
      where: {
        user_id_course_id: { user_id: userId, course_id: dto.course_id },
      },
    });
    if (existing)
      throw new BadRequestException("Siz allaqachon review qoldirgansiz");

    return this.prisma.courseReview.create({
      data: { ...dto, user_id: userId },
    });
  }
  async findAll() {
    return this.prisma.courseReview.findMany({
      include: { user: true, course: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(userId: number, reviewId: number, dto: UpdateCourseReviewDto) {
    const review = await this.prisma.courseReview.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundException("Review topilmadi");
    if (review.user_id !== userId) throw new ForbiddenException("Ruxsat yo'q");

    return this.prisma.courseReview.update({
      where: { id: reviewId },
      data: dto,
    });
  }

  async remove(userId: number, reviewId: number) {
    const review = await this.prisma.courseReview.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundException("Review topilmadi");
    if (review.user_id !== userId) throw new ForbiddenException("Ruxsat yo'q");

    return this.prisma.courseReview.delete({ where: { id: reviewId } });
  }

  async findByCourse(courseId: number) {
    return this.prisma.courseReview.findMany({
      where: { course_id: courseId },
      include: { user: true },
    });
  }
}
