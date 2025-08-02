// src/common/guards/isCreator.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new ForbiddenException("Token yo‘q");

    const token = authHeader.split(" ")[1];
    const payload: any = jwt.verify(
      token,
      this.config.get<string>("ACCESS_TOKEN_KEY_ADMIN")!
    );

    if (!payload?.is_creator) {
      throw new ForbiddenException("Siz creator admin emassiz");
    }

    req.user = payload;
    return true;
  }
}
