import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { GroupMessagesService } from "./group-message.service";
import { CreateGroupMessageDto } from "./dto/create-group-message.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import { HasAccessToGroupGuard } from "../common/guards/hasAccessToGroup.guard";
import { IsTeacherOrAdminGuard } from "../common/guards/teacherOrAdmin.guard";

@ApiTags("Group Messages")
@ApiBearerAuth("access-token")
@UseGuards(JwtAuthGuard)
@Controller("group-message")
export class GroupMessageController {
  constructor(private readonly groupMessageService: GroupMessagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, HasAccessToGroupGuard)
  @ApiOperation({ summary: "Send message to group (only if purchased)" })
  @ApiResponse({ status: 201, description: "Message created" })
  create(@Body() dto: CreateGroupMessageDto) {
    return this.groupMessageService.create(dto);
  }

  @Get()
  @UseGuards(HasAccessToGroupGuard)
  @ApiQuery({ name: "groupId", required: true })
  @ApiOperation({ summary: "Get messages by group (only purchased)" })
  @ApiResponse({ status: 200, description: "Messages list" })
  findAll(
    @Query("groupId") groupId: string,
    @Query("take") take?: string,
    @Query("skip") skip?: string
  ) {
    return this.groupMessageService.findAll(Number(groupId), {
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, HasAccessToGroupGuard)
  @ApiOperation({ summary: "Get single message" })
  @ApiResponse({ status: 200, description: "Single message" })
  async findOne(@Param("id") id: string) {
    return this.groupMessageService.findOne(+id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, IsTeacherOrAdminGuard)
  @ApiOperation({ summary: "Delete message (only admin or course owner)" })
  @ApiResponse({ status: 200, description: "Message deleted" })
  remove(@Param("id") id: string) {
    return this.groupMessageService.remove(+id);
  }
}
