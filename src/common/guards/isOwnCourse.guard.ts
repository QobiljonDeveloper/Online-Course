// src/common/guards/is-own-course.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class IsOwnCourseGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req["user"];
    const courseId = Number(req.params.id);

    if (!user) throw new ForbiddenException("Foydalanuvchi aniqlanmadi");

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) throw new ForbiddenException("Kurs topilmadi");

    if (course.teacher_id !== user.sub) {
      throw new ForbiddenException("Bu kurs ustida ruxsatingiz yo‘q");
    }

    return true;
  }
}
