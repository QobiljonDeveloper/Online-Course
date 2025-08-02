import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    const existing = await this.prisma.admins.findUnique({
      where: { email: createAdminDto.email },
    });
    if (existing) {
      throw new ConflictException(
        `Admin with email ${createAdminDto.email} already exists`
      );
    }

    return this.prisma.admins.create({
      data: createAdminDto,
    });
  }

  async findAll() {
    return this.prisma.admins.findMany();
  }

  async findOneByEmail(email: string) {
    return this.prisma.admins.findUnique({
      where: { email },
    });
  }

  async findOne(id: number) {
    const admin = await this.prisma.admins.findUnique({
      where: { id },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    await this.findOne(id);
    if (updateAdminDto.email) {
      const other = await this.prisma.admins.findUnique({
        where: { email: updateAdminDto.email },
      });
      if (other && other.id !== id) {
        throw new ConflictException(
          `Email ${updateAdminDto.email} is already used by another admin`
        );
      }
    }
    return this.prisma.admins.update({
      where: { id },
      data: updateAdminDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.admins.delete({
      where: { id },
    });
  }
}
