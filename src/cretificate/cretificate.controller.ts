import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import { CertificateService } from "./cretificate.service";
import { CreateCertificateDto } from "./dto/create-cretificate.dto";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { IsAdminGuard } from "../common/guards/isAdmin.guard";
import { SelfGuard } from "../common/guards/self.guard";

@ApiTags("Certificates")
@ApiBearerAuth("access-token")
@Controller("certificates")
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @ApiOperation({ summary: "Sertifikat chiqarish (faqat admin)" })
  @ApiResponse({
    status: 201,
    description: "Sertifikat muvaffaqiyatli yaratildi",
  })
  @ApiResponse({ status: 400, description: "Kurs yakunlanmagan" })
  @ApiResponse({ status: 403, description: "Ruxsat yo‘q (admin emas)" })
  async issue(@Body() dto: CreateCertificateDto) {
    return this.certificateService.issueCertificate(dto);
  }

  @Get("my")
  @UseGuards(JwtAuthGuard, SelfGuard)
  @ApiOperation({ summary: "Mening sertifikatlarimni olish" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchining barcha sertifikatlari",
  })
  @ApiResponse({ status: 401, description: "Token noto‘g‘ri yoki yo‘q" })
  async getMine(@Request() req) {
    return this.certificateService.findByUser(req.user.userId);
  }
}
