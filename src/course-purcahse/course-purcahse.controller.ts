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
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from "@nestjs/swagger";
import { CreateCoursePurchaseDto } from "./dto/create-course-purcahse.dto";
import { CoursePurchaseService } from "./course-purcahse.service";

@ApiTags("CoursePurchase")
@Controller("course-purchase")
export class CoursePurchaseController {
  constructor(private readonly service: CoursePurchaseService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Kurs sotib olish" })
  create(@Req() req: any, @Body() dto: CreateCoursePurchaseDto) {
    return this.service.create(req.user.sub, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  findByUser(@Req() req: any) {
    return this.service.findByUser(req.user.sub);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
