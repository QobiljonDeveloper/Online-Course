import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PurchaseStatus } from "../../../generated/prisma";

@Injectable()
export class HasAccessToGroupGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user || !user.sub)
      throw new ForbiddenException(
        "Foydalanuvchi autentifikatsiyadan o‘tmagan"
      );

    const groupId =
      Number(req.params.groupId) ||
      Number(req.query.groupId) ||
      Number(req.body.groupId) ||
      Number(req.body.group_id);

    if (!groupId) throw new ForbiddenException("Group ID topilmadi");

    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      select: { courseId: true },
    });
    if (!group) throw new NotFoundException("Guruh topilmadi");

    const purchase = await this.prisma.coursePurchase.findUnique({
      where: {
        user_id_course_id: {
          user_id: user.sub,
          course_id: group.courseId,
        },
      },
    });

    if (!purchase || purchase.status !== PurchaseStatus.COMPLETED) {
      throw new ForbiddenException("Bu kurs sotib olinmagan");
    }

    return true;
  }
}
