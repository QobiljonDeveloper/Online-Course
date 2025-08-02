import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CourseReviewService } from "./course-review.service";
import { CreateCourseReviewDto } from "./dto/create-course-review.dto";
import { UpdateCourseReviewDto } from "./dto/update-course-review.dto";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { HasPurchasedCourseGuard } from "../common/guards/hasPurchasedCourse.guard";
import { IsOwnReviewGuard } from "../common/guards/isOwnReview.guard";

@ApiTags("CourseReview")
@Controller("course-review")
export class CourseReviewController {
  constructor(private readonly service: CourseReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard, HasPurchasedCourseGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Kursga review qoldirish (faqat sotib olganlar)" })
  @ApiCreatedResponse({ description: "Review muvaffaqiyatli yaratildi" })
  @ApiBadRequestResponse({
    description: "Allaqachon review qoldirilgan yoki noto‘g‘ri ma’lumot",
  })
  @ApiUnauthorizedResponse({ description: "Token yo‘q yoki noto‘g‘ri" })
  @ApiForbiddenResponse({ description: "Kurs sotib olinmagan" })
  create(@Req() req: any, @Body() dto: CreateCourseReviewDto) {
    return this.service.create(req.user.sub, dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, IsOwnReviewGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "O‘z reviewini yangilash" })
  @ApiOkResponse({ description: "Review yangilandi" })
  @ApiUnauthorizedResponse({ description: "Token yo‘q yoki noto‘g‘ri" })
  @ApiForbiddenResponse({ description: "O‘z reviewi emas" })
  @ApiNotFoundResponse({ description: "Review topilmadi" })
  update(
    @Req() req: any,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCourseReviewDto
  ) {
    return this.service.update(req.user.sub, id, dto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha reviewlar ro‘yxatini olish" })
  @ApiOkResponse({ description: "Barcha reviewlar ro‘yxati" })
  findAll() {
    return this.service.findAll();
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, IsOwnReviewGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "O‘z reviewini o‘chirish" })
  @ApiOkResponse({ description: "Review o‘chirildi" })
  @ApiUnauthorizedResponse({ description: "Token yo‘q yoki noto‘g‘ri" })
  @ApiForbiddenResponse({ description: "O‘z reviewi emas" })
  @ApiNotFoundResponse({ description: "Review topilmadi" })
  remove(@Req() req: any, @Param("id", ParseIntPipe) id: number) {
    return this.service.remove(req.user.sub, id);
  }

  @Get("course/:courseId")
  @ApiOperation({ summary: "Berilgan kursdagi barcha reviewlar" })
  @ApiOkResponse({ description: "Reviewlar ro‘yxati" })
  @ApiNotFoundResponse({ description: "Kurs topilmadi yoki review yo‘q" })
  findByCourse(@Param("courseId", ParseIntPipe) courseId: number) {
    return this.service.findByCourse(courseId);
  }
}
