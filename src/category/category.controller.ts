import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
  ParseIntPipe,
  NotFoundException,
} from "@nestjs/common";
import { CategoriesService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import { IsAdminGuard } from "../common/guards/isAdmin.guard";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Yangi kategoriya yaratish (autentifikatsiya talab qilinadi)",
  })
  @ApiCreatedResponse({
    description: "Kategoriya muvaffaqiyatli yaratildi",
    schema: {
      example: {
        id: 1,
        name: "Frontend",
        description: "Web dasturlashga oid kurslar",
        createdAt: "2025-08-02T12:00:00.000Z",
        updatedAt: "2025-08-02T12:00:00.000Z",
      },
    },
  })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri yuborilgan ma'lumot" })
  @ApiUnauthorizedResponse({ description: "Token yo‘q yoki yaroqsiz" })
  async create(@Body() dto: CreateCategoryDto) {
    this.logger.log("Creating category...");
    return this.categoriesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha kategoriyalarni olish" })
  @ApiOkResponse({
    description: "Kategoriyalar ro‘yxati",
    schema: {
      example: [
        {
          id: 1,
          name: "Frontend",
          description: "Web dasturlashga oid kurslar",
          createdAt: "2025-08-02T12:00:00.000Z",
          updatedAt: "2025-08-02T12:30:00.000Z",
        },
        {
          id: 2,
          name: "Backend",
          description: "Server tomonidagi kurslar",
          createdAt: "2025-08-01T09:00:00.000Z",
          updatedAt: "2025-08-01T10:15:00.000Z",
        },
      ],
    },
  })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  @ApiParam({ name: "id", type: Number })
  @ApiOperation({ summary: "ID bo‘yicha kategoriya olish" })
  @ApiOkResponse({
    description: "Topilgan kategoriya",
    schema: {
      example: {
        id: 1,
        name: "Frontend",
        description: "Web dasturlashga oid kurslar",
        createdAt: "2025-08-02T12:00:00.000Z",
        updatedAt: "2025-08-02T12:30:00.000Z",
      },
    },
  })
  @ApiNotFoundResponse({ description: "Kategoriya topilmadi" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const category = await this.categoriesService.findOne(id);
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Kategoriya yangilash (autentifikatsiya talab qilinadi)",
  })
  @ApiOkResponse({
    description: "Kategoriya yangilandi",
    schema: {
      example: {
        id: 1,
        name: "Frontend Updated",
        description: "Yangilangan ta'rif",
        createdAt: "2025-08-02T12:00:00.000Z",
        updatedAt: "2025-08-02T13:00:00.000Z",
      },
    },
  })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri yuborilgan ma'lumot" })
  @ApiUnauthorizedResponse({ description: "Token yo‘q yoki yaroqsiz" })
  @ApiNotFoundResponse({ description: "Kategoriya topilmadi" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto
  ) {
    this.logger.log(`Updating category ${id}`);
    return this.categoriesService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Kategoriya o‘chirish (autentifikatsiya talab qilinadi)",
  })
  @ApiOkResponse({
    description: "O‘chirildi",
    schema: {
      example: { success: true },
    },
  })
  @ApiUnauthorizedResponse({ description: "Token yo‘q yoki yaroqsiz" })
  @ApiNotFoundResponse({ description: "Kategoriya topilmadi" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    this.logger.log(`Deleting category ${id}`);
    return this.categoriesService.remove(id);
  }
}
