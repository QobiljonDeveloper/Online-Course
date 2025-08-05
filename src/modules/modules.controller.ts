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
import { ModulesService } from "./modules.service";
import { CreateModuleDto } from "./dto/create-module.dto";
import { UpdateModuleDto } from "./dto/update-module.dto";
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
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import { IsTeacherOrAdminGuard } from "../common/guards/teacherOrAdmin.guard";

@ApiTags("Modules")
@Controller("modules")
export class ModulesController {
  private readonly logger = new Logger(ModulesController.name);

  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, IsTeacherOrAdminGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Yangi modul yaratish (autentifikatsiya talab qilinadi)",
  })
  @ApiCreatedResponse({
    description: "Modul yaratildi",
    schema: {
      example: {
        id: 5,
        course_id: 2,
        title: "Kirish qismi",
        createdAt: "2025-08-02T12:00:00.000Z",
        updatedAt: "2025-08-02T12:00:00.000Z",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Noto‘g‘ri ma'lumot yoki kurs topilmadi",
  })
  @ApiUnauthorizedResponse({
    description: "Autentifikatsiya yo‘q yoki yaroqsiz",
  })
  async create(@Body() dto: CreateModuleDto) {
    this.logger.log("Creating module...");
    return this.modulesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha modullarni olish" })
  @ApiOkResponse({
    description: "Modullar ro‘yxati",
    schema: {
      example: [
        {
          id: 5,
          course_id: 2,
          title: "Kirish qismi",
          createdAt: "2025-08-02T12:00:00.000Z",
          updatedAt: "2025-08-02T12:30:00.000Z",
        },
      ],
    },
  })
  async findAll() {
    return this.modulesService.findAll();
  }

  @Get(":id")
  @ApiParam({ name: "id", type: Number })
  @ApiOperation({ summary: "ID bo‘yicha modulni olish" })
  @ApiOkResponse({
    description: "Topilgan modul",
    schema: {
      example: {
        id: 5,
        course_id: 2,
        title: "Kirish qismi",
        createdAt: "2025-08-02T12:00:00.000Z",
        updatedAt: "2025-08-02T12:30:00.000Z",
      },
    },
  })
  @ApiNotFoundResponse({ description: "Modul topilmadi" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const module = await this.modulesService.findOne(id);
    if (!module) throw new NotFoundException("Module not found");
    return module;
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, IsTeacherOrAdminGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Modulni yangilash (autentifikatsiya talab qilinadi)",
  })
  @ApiOkResponse({
    description: "Modul yangilandi",
    schema: {
      example: {
        id: 5,
        course_id: 2,
        title: "Yangilangan sarlavha",
        createdAt: "2025-08-02T12:00:00.000Z",
        updatedAt: "2025-08-02T13:00:00.000Z",
      },
    },
  })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri ma'lumot yoki kurs yo‘q" })
  @ApiUnauthorizedResponse({
    description: "Autentifikatsiya yo‘q yoki yaroqsiz",
  })
  @ApiNotFoundResponse({ description: "Modul topilmadi" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateModuleDto
  ) {
    this.logger.log(`Updating module ${id}`);
    const updated = await this.modulesService.update(id, dto);
    if (!updated) throw new NotFoundException("Module not found");
    return updated;
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, IsTeacherOrAdminGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Modulni o‘chirish (autentifikatsiya talab qilinadi)",
  })
  @ApiOkResponse({
    description: "O‘chirildi",
    schema: {
      example: { success: true },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Autentifikatsiya yo‘q yoki yaroqsiz",
  })
  @ApiNotFoundResponse({ description: "Modul topilmadi" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    this.logger.log(`Deleting module ${id}`);
    return this.modulesService.remove(id);
  }
}
