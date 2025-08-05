import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateGroupMessageDto } from "./dto/create-group-message.dto";
import { UpdateGroupMessageDto } from "./dto/update-group-message.dto";

export interface FindOptions {
  take?: number;
  skip?: number;
}

@Injectable()
export class GroupMessagesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGroupMessageDto) {
    return this.prisma.groupMessage.create({ data: dto });
  }

  async findAll(groupId?: number, options: FindOptions = {}) {
    if (!groupId) {
      return this.prisma.groupMessage.findMany({
        orderBy: { sentAt: "desc" },
        take: options.take,
        skip: options.skip,
        include: { sender: true, group: true },
      });
    }

    return this.prisma.groupMessage.findMany({
      where: { groupId },
      orderBy: { sentAt: "desc" },
      take: options.take,
      skip: options.skip,
      include: { sender: true, group: true },
    });
  }

  async findOne(id: number) {
    const message = await this.prisma.groupMessage.findUnique({
      where: { id },
      include: { sender: true, group: true },
    });
    if (!message) throw new NotFoundException("Message not found");
    return message;
  }

  async update(id: number, dto: UpdateGroupMessageDto) {
    return this.prisma.groupMessage.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.groupMessage.delete({ where: { id } });
  }
}
