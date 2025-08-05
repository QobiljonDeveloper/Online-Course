import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class IsMessageOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const messageId = parseInt(request.params.id, 10);

    const message = await this.prisma.privateMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new ForbiddenException("Xabar topilmadi");
    }

    if (message.senderId !== user.id) {
      throw new ForbiddenException("Bu amalni bajarishga huquqingiz yo‘q");
    }

    return true;
  }
}
