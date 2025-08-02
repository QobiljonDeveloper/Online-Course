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
  Query,
  Req,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import { GetAdminNotificationsDto } from "./dto/get-admin-notifi.dto";
import { IsAdminGuard } from "../common/guards/isAdmin.guard";

@ApiTags("Notifications")
@ApiBearerAuth("access-token")
@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: "Yangi bildirishnoma yaratish" })
  @ApiResponse({ status: 201, description: "Bildirishnoma yaratildi" })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha bildirishnomalarni olish" })
  @ApiResponse({ status: 200, description: "Ro‘yxat qaytarildi" })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get("admin")
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @ApiOperation({ summary: "Adminning barcha notificationlari" })
  @ApiQuery({
    name: "unreadOnly",
    required: false,
    type: Boolean,
    description: "Faqat o‘qilmaganlarni olish",
  })
  async getAdminNotifications(
    @Query() query: GetAdminNotificationsDto,
    @Req() req: Request
  ) {
    const adminId = req["admin"].id;
    return this.notificationsService.getAdminNotifications(
      adminId,
      query.unreadOnly
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "ID bo‘yicha bildirishnoma olish" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Topildi" })
  @ApiResponse({ status: 404, description: "Topilmadi" })
  findOne(@Param("id") id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Bildirishnomani yangilash" })
  @ApiParam({ name: "id", type: Number })
  update(@Param("id") id: string, @Body() dto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Bildirishnomani o‘chirish" })
  @ApiParam({ name: "id", type: Number })
  remove(@Param("id") id: string) {
    return this.notificationsService.remove(+id);
  }
}
