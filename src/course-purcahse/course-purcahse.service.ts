import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCoursePurchaseDto } from "./dto/create-course-purcahse.dto";

@Injectable()
export class CoursePurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateCoursePurchaseDto) {
    const existing = await this.prisma.coursePurchase.findUnique({
      where: {
        user_id_course_id: { user_id: userId, course_id: dto.course_id },
      },
    });
    if (existing)
      throw new BadRequestException("Bu kurs allaqachon sotib olingan");

    return this.prisma.coursePurchase.create({
      data: { ...dto, user_id: userId },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.coursePurchase.findMany({
      where: { user_id: userId },
      include: { course: true },
    });
  }

  async findOne(id: number) {
    const purchase = await this.prisma.coursePurchase.findUnique({
      where: { id },
    });
    if (!purchase) throw new NotFoundException("Purchase topilmadi");
    return purchase;
  }
}
