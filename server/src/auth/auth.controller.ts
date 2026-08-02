import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserData } from './types/current-user.interface';
import { AuthService } from './auth.service';
import { CookieService } from './services/cookie.service';
import { SessionService, SessionMetadata } from './services/session.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly sessionService: SessionService,
  ) {}

  @UseGuards(ThrottlerGuard)
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto): Promise<MessageResponseDto> {
    return this.authService.verifyEmail(dto);
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post('resend-verification')
  resendVerification(
    @Body() dto: ResendVerificationDto,
  ): Promise<MessageResponseDto> {
    return this.authService.resendVerification(dto);
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const existingRefreshToken = this.cookieService.getRefreshToken(req);
    const { accessToken, refreshToken, user } = await this.authService.login(
      dto,
      this.getSessionMetadata(req),
      existingRefreshToken,
    );
    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    return new LoginResponseDto(accessToken, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<UserResponseDto> {
    return this.authService.getCurrentUser(currentUser.id);
  }

  // Temporary endpoint for the auth test dashboard (client/src/app/dashboard).
  // Verifies the full JWT + refresh flow end-to-end; remove alongside that
  // page once the real dashboard lands.
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('ping')
  ping(): MessageResponseDto {
    return new MessageResponseDto(
      'User successfully reached the protected endpoint.',
    );
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponseDto> {
    const rawRefreshToken = this.cookieService.getRefreshToken(req);
    if (!rawRefreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const { accessToken, refreshToken } =
      await this.sessionService.rotateSession(
        rawRefreshToken,
        this.getSessionMetadata(req),
      );
    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    return new RefreshResponseDto(accessToken);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MessageResponseDto> {
    const rawRefreshToken = this.cookieService.getRefreshToken(req);
    if (rawRefreshToken) {
      await this.sessionService.revokeSession(rawRefreshToken);
    }
    this.cookieService.clearRefreshTokenCookie(res);
    return new MessageResponseDto('Logged out successfully');
  }

  private getSessionMetadata(req: Request): SessionMetadata {
    return {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };
  }
}
