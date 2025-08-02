import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const user = request["user"];
    const paramId = Number(request.params.id);

    if (!user) {
      throw new UnauthorizedException("Foydalanuvchi aniqlanmadi");
    }

    if (!paramId || user.sub !== paramId) {
      throw new ForbiddenException("Siz ushbu resursga kira olmaysiz");
    }

    return true;
  }
}
