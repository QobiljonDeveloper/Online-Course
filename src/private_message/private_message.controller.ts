import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Get,
  Request,
} from "@nestjs/common";
import { PrivateMessageService } from "./private_message.service";
import { CreatePrivateMessageDto } from "./dto/create-private_message.dto";
import { UpdatePrivateMessageDto } from "./dto/update-private_message.dto";
import { PrivateChatAccessGuard } from "../common/guards/privateChatAccess.guard";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import { IsMessageOwnerGuard } from "../common/guards/isMessageOwner.guard";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("private-messages")
@ApiBearerAuth("access-token")
export class PrivateMessagesController {
  constructor(private readonly privateMessageService: PrivateMessageService) {}

  @UseGuards(JwtAuthGuard, PrivateChatAccessGuard)
  @Post()
  async create(@Request() req, @Body() dto: CreatePrivateMessageDto) {
    return this.privateMessageService.create(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard, IsMessageOwnerGuard)
  @Patch(":id")
  async update(
    @Request() req,
    @Param("id") id: string,
    @Body() dto: UpdatePrivateMessageDto
  ) {
    return this.privateMessageService.update(req.user.userId, +id, dto);
  }

  @UseGuards(JwtAuthGuard, IsMessageOwnerGuard)
  @Delete(":id")
  async remove(@Request() req, @Param("id") id: string) {
    return this.privateMessageService.remove(req.user.userId, +id);
  }

  @UseGuards(JwtAuthGuard, PrivateChatAccessGuard)
  @Get("dialog/:receiverId")
  async getDialog(@Request() req, @Param("receiverId") receiverId: string) {
    return this.privateMessageService.getDialog(req.user.userId, +receiverId);
  }
}
