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

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user; // JwtAuthGuard orqali keladi
    const courseId = Number(req.body.course_id || req.params.courseId);
    if (!courseId) throw new ForbiddenException("Course ID topilmadi");

    const purchase = await this.prisma.coursePurchase.findUnique({
      where: { user_id_course_id: { user_id: user.sub, course_id: courseId } },
    });

    if (!purchase || purchase.status !== PurchaseStatus.COMPLETED) {
      throw new ForbiddenException("Bu kurs sotib olinmagan");
    }

    return true;
  }
}
