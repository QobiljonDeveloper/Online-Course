import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePrivateMessageDto } from "./dto/create-private_message.dto";
import { UpdatePrivateMessageDto } from "./dto/update-private_message.dto";

@Injectable()
export class PrivateMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreatePrivateMessageDto) {
    return this.prisma.privateMessage.create({
      data: {
        senderId: userId,
        privateChatId: dto.privateChatId,
        content: dto.content,
      },
    });
  }

  async findAll(chatId: number) {
    return this.prisma.privateMessage.findMany({
      where: { privateChatId: chatId },
      include: {
        sender: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async update(
    userId: number,
    messageId: number,
    dto: UpdatePrivateMessageDto
  ) {
    const message = await this.prisma.privateMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) throw new NotFoundException("Xabar topilmadi");
    if (message.senderId !== userId)
      throw new ForbiddenException("Tahrirlashga ruxsat yo‘q");

    return this.prisma.privateMessage.update({
      where: { id: messageId },
      data: { content: dto.content },
    });
  }

  async remove(userId: number, id: number) {
    const message = await this.prisma.privateMessage.findUnique({
      where: { id },
    });

    if (!message) throw new NotFoundException("Xabar topilmadi");
    if (message.senderId !== userId)
      throw new ForbiddenException("O‘chirishga ruxsat yo‘q");

    return this.prisma.privateMessage.delete({ where: { id } });
  }

  async getDialog(userId: number, receiverId: number) {
    const chat = await this.prisma.privateChat.findFirst({
      where: {
        OR: [
          { user1_id: userId, user2_id: receiverId },
          { user1_id: receiverId, user2_id: userId },
        ],
      },
    });

    if (!chat) throw new NotFoundException("Chat topilmadi");

    return this.prisma.privateMessage.findMany({
      where: { privateChatId: chat.id },
      include: {
        sender: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }
}
