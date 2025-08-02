import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { AdminsService } from "src/admins/admins.service";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Token topilmadi");
    }

    const token = authHeader.split(" ")[1];
    let payload: any;

    try {
      const secret = this.configService.get<string>("ACCESS_TOKEN_KEY_ADMIN");
      if (!secret) throw new Error("ACCESS_TOKEN_KEY_ADMIN is undefined");

      payload = jwt.verify(token, secret);
    } catch (err) {
      console.error("JWT ERROR:", err.message);
      throw new UnauthorizedException("Token noto‘g‘ri yoki muddati tugagan");
    }

    const admin = await this.adminsService.findOneByEmail(payload.email);
    if (!admin) {
      throw new ForbiddenException("Siz admin emassiz");
    }

    if (admin.is_creator === true || payload.role === "ADMIN") {
      req["admin"] = admin;
      return true;
    }

    throw new ForbiddenException("Sizda ruxsat yo‘q");
  }
}
