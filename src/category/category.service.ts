// src/categories/categories.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
    return this.mapToResponse(category);
  }

  async findAll() {
    const categories = await this.prisma.category.findMany();
    return categories.map(this.mapToResponse);
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException("Category not found");
    return this.mapToResponse(category);
  }

  async update(id: number, dto: UpdateCategoryDto) {
    // Tekshir: mavjudligini tekshirib, keyin yangilash
    try {
      const updated = await this.prisma.category.update({
        where: { id },
        data: {
          name: dto.name,
          description: dto.description,
        },
      });
      return this.mapToResponse(updated);
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

  private mapToResponse(category: any) {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt?.toISOString(),
      updatedAt: category.updatedAt?.toISOString(),
    };
  }
}
