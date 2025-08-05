import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCertificateDto } from "./dto/create-cretificate.dto";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class CertificateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationsService
  ) {}

  async issueCertificate(dto: CreateCertificateDto) {
    const progress = await this.prisma.courseProgress.findUnique({
      where: {
        user_id_course_id: {
          user_id: dto.user_id,
          course_id: dto.course_id,
        },
      },
    });

    if (!progress || Number(progress.completed_percentage) < 100) {
      throw new BadRequestException("Kurs hali to‘liq yakunlanmagan");
    }

    const certificate = await this.prisma.certificate.create({
      data: {
        user_id: dto.user_id,
        course_id: dto.course_id,
        certificate_url: dto.certificate_url,
      },
    });
    const course = await this.prisma.course.findUnique({
      where: { id: dto.course_id },
    });

    await this.notificationService.create({
      user_id: dto.user_id,
      title: "Sertifikat taqdim etildi",
      message: `Siz "${course?.title}" kursini yakunladingiz. Sertifikat taqdim etildi!`,
      read: false,
    });

    return certificate;
  }

  async findByUser(userId: number) {
    return this.prisma.certificate.findMany({
      where: { user_id: userId },
      include: {
        course: true,
      },
    });
  }
}
