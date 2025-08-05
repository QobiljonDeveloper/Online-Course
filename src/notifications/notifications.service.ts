import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: dto });
  }

  async findAll() {
    return this.prisma.notification.findMany();
  }

  async getUserNotifications(userId: number) {
    return this.prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAdminNotifications(adminId: number, unreadOnly: boolean = false) {
    return this.prisma.notification.findMany({
      where: {
        admin_id: adminId,
        ...(unreadOnly ? { read: false } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) throw new NotFoundException("Bildirishnoma topilmadi");
    return notification;
  }

  async update(id: number, dto: UpdateNotificationDto) {
    return this.prisma.notification.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.notification.delete({ where: { id } });
  }
}
