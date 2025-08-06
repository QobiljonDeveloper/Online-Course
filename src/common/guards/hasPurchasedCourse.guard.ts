import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PurchaseStatus } from "../../../generated/prisma";

@Injectable()
export class HasPurchasedCourseGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.sub) {
      throw new ForbiddenException("Foydalanuvchi aniqlanmadi");
    }

    const courseIdRaw =
      request.body.course_id ||
      request.params.courseId ||
      request.query.course_id;

    const courseId = Number(courseIdRaw);

    if (!courseId || isNaN(courseId)) {
      throw new ForbiddenException(
        "Course ID topilmadi yoki noto‘g‘ri formatda"
      );
    }

    if (user.role === "ADMIN") {
      return true;
    }

    if (user.is_creator) {
      const isCreator = await this.prisma.course.findFirst({
        where: {
          id: courseId,
          teacher_id: user.sub,
        },
      });

      if (isCreator) {
        return true;
      }
    }

    const purchase = await this.prisma.coursePurchase.findFirst({
      where: {
        user_id: user.sub,
        course_id: courseId,
        status: PurchaseStatus.COMPLETED,
      },
    });

    if (purchase) {
      return true;
    }

    throw new ForbiddenException(
      "Bu kurs hali sotib olinmagan yoki sizda ruxsat yo‘q"
    );
  }
}
