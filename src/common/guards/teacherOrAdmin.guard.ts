import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { AdminsService } from "src/admins/admins.service";

@Injectable()
export class IsTeacherOrAdminGuard implements CanActivate {
  constructor(private readonly adminsService: AdminsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const user = req["user"] as any;

    if (!user) {
      throw new UnauthorizedException(
        "Foydalanuvchi autentifikatsiyadan o‘tmagan"
      );
    }

    const role = String(user.role || "").toUpperCase();

    if (role === "TEACHER") {
      return true;
    }

    if (user.is_creator === true) {
      return true;
    }

    if (role === "ADMIN") {
      const admin = await this.adminsService.findOneByEmail(user.email);
      if (!admin) {
        throw new ForbiddenException("Siz admin emassiz");
      }

      if (admin.is_creator === true || role === "ADMIN") {
        req["admin"] = admin;
        return true;
      }
    }

    throw new ForbiddenException("Bu resursga kirish uchun ruxsat yo‘q");
  }
}
