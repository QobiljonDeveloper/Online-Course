import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const exists = await this.prisma.category.findFirst({
      where: { name: dto.name },
    });

    if (exists) {
      throw new BadRequestException("Bunday Category allaqachon mavjud");
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        description: dto.description,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }
  async findAll() {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: {
          name: dto.name,
          description: dto.description,
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });
    } catch (e) {
      throw new NotFoundException("Category not found");
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.category.delete({ where: { id } });
      return { success: true };
    } catch (e) {
      throw new NotFoundException("Category not found");
    }
  }
}
