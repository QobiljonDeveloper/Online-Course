import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePrivateChatDto } from "./dto/create-private_chat.dto";
import { PurchaseStatus } from "../../generated/prisma";

@Injectable()
export class PrivateChatService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateParticipants(
    user1Id: number,
    user2Id: number,
    courseId: number
  ) {
    const [p1, p2] = await Promise.all([
      this.prisma.coursePurchase.findUnique({
        where: {
          user_id_course_id: {
            user_id: user1Id,
            course_id: courseId,
          },
        },
      }),
      this.prisma.coursePurchase.findUnique({
        where: {
          user_id_course_id: {
            user_id: user2Id,
            course_id: courseId,
          },
        },
      }),
    ]);

    if (
      !p1 ||
      !p2 ||
      p1.status !== PurchaseStatus.COMPLETED ||
      p2.status !== PurchaseStatus.COMPLETED
    ) {
      throw new ForbiddenException(
        "Ikkala foydalanuvchi ham kursni to‘liq sotib olmagan"
      );
    }

    const user1Groups = await this.prisma.groupMember.findMany({
      where: {
        user_id: user1Id,
        group: { courseId },
      },
      select: { group_id: true },
    });
    const user2Groups = await this.prisma.groupMember.findMany({
      where: {
        user_id: user2Id,
        group: { courseId },
      },
      select: { group_id: true },
    });

    const user1Set = new Set(user1Groups.map((g) => g.group_id));
    const common = user2Groups
      .map((g) => g.group_id)
      .filter((id) => user1Set.has(id));
    if (common.length === 0) {
      throw new ForbiddenException("Foydalanuvchilar umumiy guruhda emaslar");
    }
  }

  async create(dto: CreatePrivateChatDto) {
    if (dto.user1_id === dto.user2_id) {
      throw new BadRequestException(
        "Foydalanuvchilar bir xil bo‘lishi mumkin emas"
      );
    }

    const existing = await this.prisma.privateChat.findFirst({
      where: {
        course_id: dto.course_id,
        OR: [
          { user1_id: dto.user1_id, user2_id: dto.user2_id },
          { user1_id: dto.user2_id, user2_id: dto.user1_id },
        ],
      },
    });
    if (existing) return existing;

    await this.validateParticipants(dto.user1_id, dto.user2_id, dto.course_id);

    return this.prisma.privateChat.create({
      data: {
        user1_id: dto.user1_id,
        user2_id: dto.user2_id,
        course_id: dto.course_id,
      },
      include: {
        user1: true,
        user2: true,
        course: true,
      },
    });
  }

  async findOne(id: number) {
    const chat = await this.prisma.privateChat.findUnique({
      where: { id },
      include: {
        user1: true,
        user2: true,
        course: true,
        messages: {
          orderBy: { createdAt: "desc" },
          include: { sender: true },
        },
      },
    });
    if (!chat) throw new NotFoundException("Private chat topilmadi");
    return chat;
  }

  async findAllForUser(userId: number) {
    return this.prisma.privateChat.findMany({
      where: {
        OR: [{ user1_id: userId }, { user2_id: userId }],
      },
      include: {
        user1: true,
        user2: true,
        course: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: number, dto: Partial<CreatePrivateChatDto>) {
    const chat = await this.prisma.privateChat.findUnique({ where: { id } });
    if (!chat) throw new NotFoundException("Private chat topilmadi");

    if (
      (dto.user1_id && dto.user1_id !== chat.user1_id) ||
      (dto.user2_id && dto.user2_id !== chat.user2_id) ||
      (dto.course_id && dto.course_id !== chat.course_id)
    ) {
      await this.validateParticipants(
        dto.user1_id ?? chat.user1_id,
        dto.user2_id ?? chat.user2_id,
        dto.course_id ?? chat.course_id
      );
    }

    return this.prisma.privateChat.update({
      where: { id },
      data: dto,
      include: {
        user1: true,
        user2: true,
        course: true,
      },
    });
  }

  async remove(id: number) {
    const chat = await this.prisma.privateChat.findUnique({ where: { id } });
    if (!chat) throw new NotFoundException("Private chat topilmadi");

    await this.prisma.privateMessage.deleteMany({
      where: { privateChatId: id },
    });

    return this.prisma.privateChat.delete({ where: { id } });
  }
}
