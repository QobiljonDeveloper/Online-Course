import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGroupDto) {
    return this.prisma.group.create({ data: dto });
  }

  async findAll() {
    return this.prisma.group.findMany({ include: { messages: true } });
  }

  async findOne(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: { messages: true },
    });
    if (!group) throw new NotFoundException("Group not found");
    return group;
  }

  async update(id: number, dto: UpdateGroupDto) {
    return this.prisma.group.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.group.delete({ where: { id } });
  }
}
