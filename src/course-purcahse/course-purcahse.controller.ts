import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import { CreateCoursePurchaseDto } from "./dto/create-course-purcahse.dto";
import { CoursePurchaseService } from "./course-purcahse.service";
import { IsOwnPaymentGuard } from "../common/guards/isOwnPayment.guard";

@ApiTags("CoursePurchase")
@ApiBearerAuth("access-token")
@UseGuards(JwtAuthGuard) 
@Controller("course-purchase")
export class CoursePurchaseController {
  constructor(private readonly service: CoursePurchaseService) {}

  @Post()
  @ApiOperation({ summary: "Kurs sotib olish" })
  @ApiOkResponse({ description: "Kurs muvaffaqiyatli sotib olindi" })
  create(@Req() req: any, @Body() dto: CreateCoursePurchaseDto) {
    return this.service.create(req.user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: "Foydalanuvchining barcha purchase'lari" })
  @ApiOkResponse({ description: "Purchase ro'yxati" })
  findByUser(@Req() req: any) {
    return this.service.findByUser(req.user.sub);
  }

  @Get(":id")
  @ApiOperation({ summary: "Bitta purchase'ni olish" })
  @ApiOkResponse({ description: "Purchase topildi" })
  @ApiForbiddenResponse({ description: "Sizga tegishli purchase emas" })
  @UseGuards(IsOwnPaymentGuard)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
