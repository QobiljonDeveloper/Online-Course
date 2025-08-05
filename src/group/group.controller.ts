import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { GroupsService } from "./group.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import { IsTeacherGuard } from "../common/guards/isteacher.guard";
import { IsOwnCourseGuard } from "../common/guards/isOwnCourse.guard";
import { HasAccessToGroupGuard } from "../common/guards/hasAccessToGroup.guard";
import { IsAdminGuard } from "../common/guards/isAdmin.guard";
import { IsTeacherOrAdminGuard } from "../common/guards/teacherOrAdmin.guard";

@ApiTags("Groups")
@ApiBearerAuth("access-token")
@Controller("groups")
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, IsTeacherOrAdminGuard)
  @ApiOperation({ summary: "Create group (teacher of the course)" })
  @ApiResponse({ status: 201, description: "Group created successfully" })
  create(@Body() dto: CreateGroupDto) {
    return this.groupsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all groups" })
  @ApiResponse({ status: 200, description: "List of groups" })
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, HasAccessToGroupGuard)
  @ApiOperation({
    summary: "Get group by ID (must have access via course purchase)",
  })
  @ApiResponse({ status: 200, description: "Group data" })
  findOne(@Param("id") id: string) {
    return this.groupsService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, IsTeacherOrAdminGuard)
  @ApiOperation({ summary: "Update group (teacher of the course)" })
  @ApiResponse({ status: 200, description: "Group updated" })
  update(@Param("id") id: string, @Body() dto: UpdateGroupDto) {
    return this.groupsService.update(+id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @ApiOperation({ summary: "Delete group (only admin or course owner)" })
  @ApiResponse({ status: 200, description: "Group deleted" })
  remove(@Param("id") id: string) {
    return this.groupsService.remove(+id);
  }
}
