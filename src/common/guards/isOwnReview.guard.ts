import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class IsOwnReviewGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const reviewId = Number(req.params.id);
    if (!reviewId) throw new ForbiddenException("Review ID topilmadi");

    const review = await this.prisma.courseReview.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new ForbiddenException("Review topilmadi");
    if (review.user_id !== user.sub)
      throw new ForbiddenException("Ruxsat yo'q");

    return true;
  }
}
