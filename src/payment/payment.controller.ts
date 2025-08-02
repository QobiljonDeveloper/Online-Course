import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
  Patch,
} from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentStatusDto } from "./dto/update-payment-status.dto";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { IsOwnPaymentGuard } from "../common/guards/isOwnPayment.guard";
import { IsAdminGuard } from "../common/guards/isAdmin.guard";
import { PaymentsService } from "./payment.service";

@ApiTags("Payments")
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Foydalanuvchi to‘lov yaratadi (PENDING holatda)" })
  @ApiCreatedResponse({ description: "Payment muvaffaqiyatli yaratildi" })
  create(@Req() req: any, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(req.user.sub, dto);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, IsAdminGuard) 
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Admin payment statusini yangilaydi" })
  @ApiOkResponse({ description: "Payment status yangilandi" })
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentStatusDto
  ) {
    return this.paymentsService.updateStatus(id, dto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Foydalanuvchi o‘z to‘lovlarini ko‘radi" })
  findMyPayments(@Req() req: any) {
    return this.paymentsService.findMyPayments(req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Admin barcha to‘lovlarni ko‘radi" })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, IsOwnPaymentGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Bitta paymentni olish (faqat egasi yoki admin)" })
  @ApiOkResponse({ description: "Payment topildi" })
  @ApiNotFoundResponse({ description: "Payment topilmadi" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.paymentsService.findOneById(id);
  }
}
