import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PurchaseStatus } from "../../../generated/prisma";

@Injectable()
export class PrivateChatAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user || !user.sub) {
      throw new ForbiddenException("Foydalanuvchi aniqlanmadi");
    }

    const chatId =
      Number(req.params.id) ||
      Number(req.query.chatId) ||
      Number(req.body.chatId) ||
      Number(req.body.privateChatId);

    if (!chatId) throw new ForbiddenException("Chat ID topilmadi");

    const chat = await this.prisma.privateChat.findUnique({
      where: { id: chatId },
    });
    if (!chat) throw new NotFoundException("Private chat topilmadi");

    if (chat.user1_id !== user.sub && chat.user2_id !== user.sub) {
      throw new ForbiddenException("Bu chatga kira olmaysiz");
    }

    const otherUserId =
      chat.user1_id === user.sub ? chat.user2_id : chat.user1_id;

    const [p1, p2] = await Promise.all([
      this.prisma.coursePurchase.findUnique({
        where: {
          user_id_course_id: {
            user_id: user.sub,
            course_id: chat.course_id,
          },
        },
      }),
      this.prisma.coursePurchase.findUnique({
        where: {
          user_id_course_id: {
            user_id: otherUserId,
            course_id: chat.course_id,
          },
        },
      }),
    ]);

    if (
      !p1 ||
      !p2 ||
      p1.status !== PurchaseStatus.COMPLETED ||
      p2.status !== PurchaseStatus.COMPLETED
    ) {
      throw new ForbiddenException(
        "Ikkala foydalanuvchi ham kursni sotib olmagan"
      );
    }

    const user1Groups = await this.prisma.groupMember.findMany({
      where: {
        user_id: user.sub,
        group: { courseId: chat.course_id },
      },
      select: { group_id: true },
    });

    const user2Groups = await this.prisma.groupMember.findMany({
      where: {
        user_id: otherUserId,
        group: { courseId: chat.course_id },
      },
      select: { group_id: true },
    });

    const user1Set = new Set(user1Groups.map((g) => g.group_id));
    const common = user2Groups
      .map((g) => g.group_id)
      .filter((id) => user1Set.has(id));

    if (common.length === 0) {
      throw new ForbiddenException(
        "Siz va boshqa foydalanuvchi umumiy guruhda emassiz"
      );
    }

    return true;
  }
}
