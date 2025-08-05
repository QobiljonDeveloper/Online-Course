import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";

type JwtPayload = {
  sub: number;
  email: string;
  role?: string;
  is_creator?: boolean;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  private verifyToken(token: string, secret: string): JwtPayload {
    let decoded: unknown;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      throw new UnauthorizedException("Token yaroqsiz yoki muddati tugagan");
    }

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("sub" in decoded) ||
      !("email" in decoded)
    ) {
      throw new UnauthorizedException("Token payloadi noto‘g‘ri");
    }

    const anyDec = decoded as Record<string, unknown>;

    const sub = Number(anyDec.sub);
    const email = String(anyDec.email);
    const role = anyDec.role ? String(anyDec.role).toUpperCase() : undefined;
    const is_creator =
      typeof anyDec.is_creator === "boolean" ? anyDec.is_creator : undefined;

    return { sub, email, role, is_creator };
  }

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Token yo‘q");
    }

    const token = authHeader.split(" ")[1];

    const userSecret = this.config.get<string>("ACCESS_TOKEN_KEY");
    const adminSecret = this.config.get<string>("ACCESS_TOKEN_KEY_ADMIN");

    if (!userSecret || !adminSecret) {
      throw new UnauthorizedException("Token secretlari sozlanmagan");
    }

    let payload: JwtPayload;
    let isAdminToken = false;

    try {
      payload = this.verifyToken(token, userSecret);
    } catch (e) {
      try {
        payload = this.verifyToken(token, adminSecret);
        isAdminToken = true;
      } catch (e2) {
        throw new UnauthorizedException("Token yaroqsiz yoki muddati tugagan");
      }
    }

    if (isAdminToken) {
      if (payload.role !== "ADMIN" && !payload.is_creator) {
        throw new UnauthorizedException(
          "Admin tokeni bilan mos role topilmadi"
        );
      }
      req["adminPayload"] = payload;
      req["user"] = payload;
    } else {
      if (!payload.role) {
        payload.role = "USER";
      }
      req["user"] = payload;
    }

    return true;
  }
}
