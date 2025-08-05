import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class IsOwnUserOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const userId = Number(req.params.userId);

    if (!user) {
      throw new ForbiddenException("Foydalanuvchi topilmadi");
    }

    if (user.role === "ADMIN" || user.sub === userId) {
      return true;
    }

    throw new ForbiddenException("Siz ushbu resursga kira olmaysiz");
  }
}
