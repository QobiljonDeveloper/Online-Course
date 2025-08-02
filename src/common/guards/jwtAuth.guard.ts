import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Token yo‘q");
    }

    const token = authHeader.split(" ")[1];

    const adminSecret = this.config.get<string>("ACCESS_TOKEN_KEY_ADMIN");
    const userSecret = this.config.get<string>("ACCESS_TOKEN_KEY");

    const secret = adminSecret || userSecret;
    if (!secret) {
      throw new UnauthorizedException("Token secret mavjud emas");
    }

    try {
      const payload = jwt.verify(token, secret);
      req["user"] = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException("Token yaroqsiz yoki muddati tugagan");
    }
  }
}
