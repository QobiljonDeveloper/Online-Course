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
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { SelfGuard } from "src/common/guards/self.guard";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import { IsAdminGuard } from "../common/guards/isAdmin.guard";

@ApiTags("Users")
@ApiBearerAuth("access-token")
@Controller("users")
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Create new user" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log("Creating new user...");
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, description: "All users retrieved" })
  findAll() {
    this.logger.log("Getting all users...");
    return this.usersService.findAll();
  }

  @Patch("approve-teacher/:id")
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "O‘qituvchini tasdiqlash (faqat admin)" })
  approveTeacher(@Param("id") id: string) {
    return this.usersService.approveTeacher(+id);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, SelfGuard)
  @ApiOperation({ summary: "Get user by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "User found" })
  @ApiResponse({ status: 403, description: "Access denied (not your data)" })
  @ApiResponse({ status: 404, description: "User not found" })
  findOne(@Param("id") id: string) {
    this.logger.log(`Getting user with id: ${id}`);
    return this.usersService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, SelfGuard)
  @ApiOperation({ summary: "Update user by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  @ApiResponse({ status: 403, description: "Access denied (not your data)" })
  @ApiResponse({ status: 404, description: "User not found" })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user with id: ${id}`);
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, SelfGuard)
  @ApiOperation({ summary: "Delete user by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 403, description: "Access denied (not your data)" })
  @ApiResponse({ status: 404, description: "User not found" })
  remove(@Param("id") id: string) {
    this.logger.log(`Deleting user with id: ${id}`);
    return this.usersService.remove(+id);
  }
}
