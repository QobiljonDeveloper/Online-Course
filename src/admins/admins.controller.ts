import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { AdminsService } from "./admins.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";

@ApiTags("Admins")
@ApiBearerAuth("access-token")
@Controller("admins")
export class AdminsController {
  private readonly logger = new Logger(AdminsController.name);

  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  @ApiOperation({ summary: "Create new admin" })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({ status: 201, description: "Admin created successfully" })
  @ApiResponse({ status: 409, description: "Email already exists" })
  async create(@Body() createAdminDto: CreateAdminDto) {
    this.logger.log("Creating new admin...");
    return await this.adminsService.create(createAdminDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all admins" })
  @ApiResponse({ status: 200, description: "List of admins" })
  async findAll() {
    this.logger.log("Fetching all admins...");
    return await this.adminsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get admin by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Admin found" })
  @ApiResponse({ status: 404, description: "Admin not found" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    this.logger.log(`Fetching admin with id: ${id}`);
    return await this.adminsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update admin by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ type: UpdateAdminDto })
  @ApiResponse({ status: 200, description: "Admin updated successfully" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto
  ) {
    this.logger.log(`Updating admin ${id}`);
    return await this.adminsService.update(id, updateAdminDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete admin by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Admin deleted successfully" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    this.logger.log(`Deleting admin ${id}`);
    return await this.adminsService.remove(id);
  }
}
