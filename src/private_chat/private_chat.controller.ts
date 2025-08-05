import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { PrivateChatService } from "./private_chat.service";
import { CreatePrivateChatDto } from "./dto/create-private_chat.dto";
import { UpdatePrivateChatDto } from "./dto/update-private_chat.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import { IsTeacherGuard } from "../common/guards/isteacher.guard";
import { IsAdminGuard } from "../common/guards/isAdmin.guard";
import { PrivateChatAccessGuard } from "../common/guards/privateChatAccess.guard";

@ApiTags("Private Chats")
@ApiBearerAuth("access-token")
@UseGuards(JwtAuthGuard)
@Controller("private-chat")
export class PrivateChatController {
  constructor(private readonly privateChatService: PrivateChatService) {}

  @Post()
  @UseGuards(IsTeacherGuard || PrivateChatAccessGuard || IsAdminGuard)
  @ApiOperation({ summary: "Yangi private chat yaratish" })
  @ApiResponse({ status: 201, description: "Chat yaratildi" })
  create(@Body() dto: CreatePrivateChatDto) {
    return this.privateChatService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Foydalanuvchining barcha chatlari" })
  findAll(@Req() req: any) {
    return this.privateChatService.findAllForUser(req.user.sub);
  }

  @Get(":id")
  @UseGuards(PrivateChatAccessGuard)
  @ApiOperation({
    summary: "Bitta private chatni olish (faqat ishtirokchi yoki admin)",
  })
  findOne(@Param("id") id: string) {
    return this.privateChatService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(PrivateChatAccessGuard)
  @ApiOperation({
    summary: "Private chatni yangilash (faqat ishtirokchi yoki admin)",
  })
  update(@Param("id") id: string, @Body() dto: UpdatePrivateChatDto) {
    return this.privateChatService.update(+id, dto);
  }

  @Delete(":id")
  @UseGuards(PrivateChatAccessGuard, IsAdminGuard)
  @ApiOperation({
    summary: "Private chatni o‘chirish (faqat admin yoki ishtirokchi)",
  })
  remove(@Param("id") id: string) {
    return this.privateChatService.remove(+id);
  }
}
