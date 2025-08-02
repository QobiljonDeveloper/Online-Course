import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
  Res,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import type { Response, Request } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { IsCreatorGuard } from "../common/guards/isCreator.guard";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { JwtAuthGuard } from "../common/guards/jwtAuth.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register user / teacher
  @Post("register")
  @ApiOperation({ summary: "Register user or teacher" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: "Registration email sent (activation link).",
    schema: {
      example: {
        message: "Ro‘yxatdan o‘tish muvaffaqiyatli. Emailni tekshiring.",
      },
    },
  })
  @ApiResponse({ status: 400, description: "Bad request / validation failed" })
  @ApiResponse({
    status: 403,
    description: "Email already exists or admin cannot self-register",
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // Activate account
  @Get("activate/:link")
  @ApiOperation({ summary: "Activate account by link" })
  @ApiResponse({
    status: 200,
    description: "Account activated successfully.",
    schema: { example: { message: "Akkount muvaffaqiyatli faollashtirildi" } },
  })
  @ApiResponse({ status: 404, description: "Invalid activation link" })
  async activate(@Param("link") link: string) {
    return this.authService.activate(link);
  }

  // Login user / teacher
  @Post("login")
  @ApiOperation({ summary: "Login user or teacher" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description:
      "Logged in; returns access token and user id; refresh token set in httpOnly cookie.",
    schema: {
      example: { accessToken: "jwt_access_token", id: 123 },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials or inactive / unapproved account",
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.login(dto, res);
  }

  // Refresh user token
  @Post("refresh")
  @ApiOperation({ summary: "Refresh user access token" })
  @ApiBody({
    schema: {
      properties: {
        user_id: { type: "number" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "New access (and refresh) token returned; cookie updated.",
    schema: {
      example: {
        accessToken: "new_jwt_access_token",
        refreshToken: "new_refresh_token",
      },
    },
  })
  @ApiResponse({ status: 400, description: "Missing user_id" })
  @ApiResponse({ status: 401, description: "Invalid or missing refresh token" })
  async refresh(
    @Body("user_id") user_id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    if (!user_id) throw new BadRequestException("user_id required");
    return this.authService.refresh(res, user_id);
  }

  // Logout user (cookie-based)
  @Post("logout")
  @ApiOperation({ summary: "Logout user (clears refresh token cookie)" })
  @ApiResponse({
    status: 200,
    description: "Successfully logged out; cookie cleared.",
    schema: { example: { message: "Chiqish muvaffaqiyatli amalga oshirildi" } },
  })
  @ApiResponse({ status: 401, description: "Missing or invalid refresh token" })
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const refreshToken = req.cookies?.refreshToken;
    return this.authService.logoutUserFromCookie(res, refreshToken);
  }

  // Admin login
  @Post("admin/login")
  @ApiOperation({ summary: "Admin login" })
  @ApiBody({
    schema: {
      properties: {
        email: { type: "string" },
        password: { type: "string" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      "Admin logged in; returns access token; refresh token in cookie.",
    schema: {
      example: { accessToken: "admin_jwt_access_token", refreshToken: "..." },
    },
  })
  @ApiResponse({ status: 401, description: "Invalid admin credentials" })
  async adminLogin(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.loginAdmin(dto, res);
  }

  // Refresh admin token
  @Post("admin/refresh")
  @ApiOperation({ summary: "Refresh admin access token" })
  @ApiBody({
    schema: {
      properties: {
        admin_id: { type: "number" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "New admin tokens returned; cookie updated.",
    schema: {
      example: { accessToken: "new_admin_access_token", refreshToken: "..." },
    },
  })
  @ApiResponse({ status: 400, description: "Missing admin_id" })
  @ApiResponse({
    status: 401,
    description: "Invalid or missing admin refresh token",
  })
  async refreshAdmin(
    @Body("admin_id") admin_id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    if (!admin_id) throw new BadRequestException("admin_id required");
    return this.authService.refreshAdmin(res, admin_id);
  }

  // Logout admin
  @Post("admin/logout")
  @ApiOperation({ summary: "Logout admin (clears refresh token cookie)" })
  @ApiResponse({
    status: 200,
    description: "Admin logged out; cookie cleared.",
    schema: { example: { message: "Admin chiqarildi" } },
  })
  @ApiResponse({
    status: 401,
    description: "Missing or invalid admin refresh token",
  })
  async logoutAdmin(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ) {
    const refreshToken = req.cookies?.refreshTokenAdmin;
    return this.authService.logoutAdminFromCookie(res, refreshToken);
  }

  @Post("admin/register")
  @UseGuards(JwtAuthGuard, IsCreatorGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Yangi admin yaratish (faqat is_creator=true bo‘lsa)",
  })
  @ApiResponse({
    status: 201,
    description: "Admin yaratildi",
  })
  @ApiResponse({
    status: 403,
    description: "Faqat creator adminlar kirishi mumkin",
  })
  @ApiResponse({
    status: 401,
    description: "Token noto‘g‘ri yoki yo‘q",
  })
  async registerAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.registerAdmin(dto);
  }
}
