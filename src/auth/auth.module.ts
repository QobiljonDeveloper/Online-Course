import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [JwtModule.register({}), PrismaModule, ConfigModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
