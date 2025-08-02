// src/auth/auth.service.ts
import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MailService } from "../mail/mail.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import type { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import { CreateAdminDto } from "./dto/create-admin.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService
  ) {}

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private async comparePasswords(raw: string, hashed: string) {
    return bcrypt.compare(raw, hashed);
  }

  private getSecret(key: string): string {
    const secret = this.config.get<string>(key);
    if (!secret) {
      throw new InternalServerErrorException(
        `JWT secret "${key}" is not defined`
      );
    }
    return secret;
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ForbiddenException("Bu email allaqachon ro‘yxatdan o‘tgan");
    }

    const activationLink = uuidv4();
    const hashed = await this.hashPassword(dto.password);

    const user = await this.prisma.users.create({
      data: {
        full_name: dto.full_name,
        email: dto.email,
        password: hashed,
        role: dto.role ?? "USER",
        activation_link: activationLink,
        is_active: false,
        is_teacher_approved: false,
        refresh_token: "",
      },
    });

    // Teacher bo‘lsa — barcha adminlarga notification yozish (user_id bilan)
    if ((dto.role ?? "USER") === "TEACHER") {
      const allAdmins = await this.prisma.admins.findMany();

      for (const admin of allAdmins) {
        await this.prisma.notification.create({
          data: {
            admin_id: admin.id,
            user_id: user.id,
            title: "Yangi o‘qituvchi ro‘yxatdan o‘tdi",
            message: `${user.full_name} ismli foydalanuvchi o‘qituvchi sifatida ro‘yxatdan o‘tdi.`,
          },
        });
      }
    }

    await this.mailService.sendActivationLink(
      user.full_name,
      user.email,
      activationLink
    );

    return { message: "Ro‘yxatdan o‘tish muvaffaqiyatli. Emailni tekshiring." };
  }

  // Activate
  async activate(link: string) {
    const user = await this.prisma.users.findFirst({
      where: { activation_link: link },
    });
    if (!user) {
      throw new NotFoundException("Noto‘g‘ri aktivatsiya linki");
    }

    if (user.is_active) {
      return { message: "Akkount allaqachon faollashtirilgan" };
    }

    await this.prisma.users.update({
      where: { id: user.id },
      data: { is_active: true },
    });

    return { message: "Akkount muvaffaqiyatli faollashtirildi" };
  }

  // Login user / teacher
  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException("Email yoki parol noto‘g‘ri");

    if (!user.is_active)
      throw new UnauthorizedException("Akkount faollashtirilmagan");
    if (user.role === "TEACHER" && !user.is_teacher_approved)
      throw new UnauthorizedException("O‘qituvchi hali tasdiqlanmagan");

    const match = await this.comparePasswords(dto.password, user.password);
    if (!match) throw new UnauthorizedException("Email yoki parol noto‘g‘ri");

    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.getSecret("ACCESS_TOKEN_KEY"),
      expiresIn: this.config.get<string>("ACCESS_TOKEN_TIME") ?? "15h",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.getSecret("REFRESH_TOKEN_KEY"),
      expiresIn: this.config.get<string>("REFRESH_TOKEN_TIME") ?? "15d",
    });

    await this.prisma.users.update({
      where: { id: user.id },
      data: { refresh_token: refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: parseInt(
        this.config.get<string>("COOKIE_TIME") || "1296000000",
        10
      ),
      sameSite: "lax",
    });

    return { accessToken, id: user.id };
  }

  // Refresh user tokens
  async refresh(res: Response, userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    if (!user || !user.refresh_token) {
      throw new UnauthorizedException("Foydalanuvchi yoki token topilmadi");
    }

    try {
      this.jwtService.verify(user.refresh_token, {
        secret: this.getSecret("REFRESH_TOKEN_KEY"),
      });
    } catch {
      throw new UnauthorizedException("Refresh token yaroqsiz");
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    const newAccessToken = this.jwtService.sign(payload, {
      secret: this.getSecret("ACCESS_TOKEN_KEY"),
      expiresIn: this.config.get<string>("ACCESS_TOKEN_TIME") ?? "15h",
    });
    const newRefreshToken = this.jwtService.sign(payload, {
      secret: this.getSecret("REFRESH_TOKEN_KEY"),
      expiresIn: this.config.get<string>("REFRESH_TOKEN_TIME") ?? "15d",
    });

    await this.prisma.users.update({
      where: { id: user.id },
      data: { refresh_token: newRefreshToken },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: parseInt(
        this.config.get<string>("COOKIE_TIME") || "1296000000",
        10
      ),
      sameSite: "lax",
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // Logout user (cookie-based)
  async logoutUserFromCookie(res: Response, refreshToken: string | undefined) {
    if (!refreshToken) {
      res.clearCookie("refreshToken", { httpOnly: true });
      throw new UnauthorizedException("Refresh token mavjud emas");
    }

    try {
      const payload: any = this.jwtService.verify(refreshToken, {
        secret: this.getSecret("REFRESH_TOKEN_KEY"),
      });

      await this.prisma.users.update({
        where: { id: payload.sub },
        data: { refresh_token: "" },
      });
    } catch {
      res.clearCookie("refreshToken", { httpOnly: true });
      throw new UnauthorizedException("Refresh token yaroqsiz");
    }

    res.clearCookie("refreshToken", { httpOnly: true });
    return { message: "Chiqish muvaffaqiyatli amalga oshirildi" };
  }

  // ==== ADMIN ====

  async registerAdmin(dto: CreateAdminDto) {
    const existing = await this.prisma.admins.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ForbiddenException("Bu email bilan admin allaqachon mavjud");
    }

    const hashed = await this.hashPassword(dto.password);

    await this.prisma.admins.create({
      data: {
        full_name: dto.full_name,
        email: dto.email,
        password: hashed,
        is_creator: false,
        refresh_token: "",
      },
    });

    return { message: "Admin muvaffaqiyatli yaratildi" };
  }

  async loginAdmin(dto: LoginDto, res: Response) {
    const admin = await this.prisma.admins.findUnique({
      where: { email: dto.email },
    });
    if (!admin) throw new UnauthorizedException("Admin topilmadi");

    const match = await this.comparePasswords(dto.password, admin.password);
    if (!match) throw new UnauthorizedException("Parol noto‘g‘ri");

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: "ADMIN",
      is_creator: admin.is_creator,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.getSecret("ACCESS_TOKEN_KEY_ADMIN"),
      expiresIn: this.config.get<string>("ACCESS_TOKEN_TIME_ADMIN") ?? "15h",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.getSecret("REFRESH_TOKEN_KEY_ADMIN"),
      expiresIn: this.config.get<string>("REFRESH_TOKEN_TIME_ADMIN") ?? "15d",
    });

    await this.prisma.admins.update({
      where: { id: admin.id },
      data: { refresh_token: refreshToken },
    });

    res.cookie("refreshTokenAdmin", refreshToken, {
      httpOnly: true,
      maxAge: parseInt(
        this.config.get<string>("COOKIE_TIME") || "1296000000",
        10
      ),
      sameSite: "lax",
    });

    return { accessToken, id: admin.id };
  }

  async refreshAdmin(res: Response, adminId: number) {
    const admin = await this.prisma.admins.findUnique({
      where: { id: adminId },
    });
    if (!admin || !admin.refresh_token) {
      throw new UnauthorizedException("Admin yoki token mavjud emas");
    }

    try {
      this.jwtService.verify(admin.refresh_token, {
        secret: this.getSecret("REFRESH_TOKEN_KEY_ADMIN"),
      });
    } catch {
      throw new UnauthorizedException("Refresh token yaroqsiz");
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: "ADMIN",
      is_creator: admin.is_creator,
    };

    const newAccessToken = this.jwtService.sign(payload, {
      secret: this.getSecret("ACCESS_TOKEN_KEY_ADMIN"),
      expiresIn: this.config.get<string>("ACCESS_TOKEN_TIME_ADMIN") ?? "15h",
    });
    const newRefreshToken = this.jwtService.sign(payload, {
      secret: this.getSecret("REFRESH_TOKEN_KEY_ADMIN"),
      expiresIn: this.config.get<string>("REFRESH_TOKEN_TIME_ADMIN") ?? "15d",
    });

    await this.prisma.admins.update({
      where: { id: admin.id },
      data: { refresh_token: newRefreshToken },
    });

    res.cookie("refreshTokenAdmin", newRefreshToken, {
      httpOnly: true,
      maxAge: parseInt(
        this.config.get<string>("COOKIE_TIME") || "1296000000",
        10
      ),
      sameSite: "lax",
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logoutAdminFromCookie(res: Response, refreshToken: string | undefined) {
    if (!refreshToken) {
      res.clearCookie("refreshTokenAdmin", { httpOnly: true });
      throw new UnauthorizedException("Refresh token mavjud emas");
    }

    try {
      const payload: any = this.jwtService.verify(refreshToken, {
        secret: this.getSecret("REFRESH_TOKEN_KEY_ADMIN"),
      });

      await this.prisma.admins.update({
        where: { id: payload.sub },
        data: { refresh_token: "" },
      });
    } catch {
      res.clearCookie("refreshTokenAdmin", { httpOnly: true });
      throw new UnauthorizedException("Refresh token yaroqsiz");
    }

    res.clearCookie("refreshTokenAdmin", { httpOnly: true });
    return { message: "Admin chiqarildi" };
  }
}
