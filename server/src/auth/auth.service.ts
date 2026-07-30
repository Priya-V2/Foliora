import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { EmailService } from './services/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;
}

// Express's Response is deliberately kept out of this service (cookie
// writing is the controller's job via CookieService) so AuthService stays a
// pure business-logic layer, per CLAUDE.md's "services avoid HTTP concerns".
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    const user = await this.prisma.user.create({
      data: { name: dto.name, email: dto.email, passwordHash },
    });

    const { token, tokenHash, expiresAt } =
      this.tokenService.generateVerificationToken();
    await this.prisma.verificationToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    await this.emailService.sendVerificationEmail(user.email, token);

    return new RegisterResponseDto(
      'Registration successful. Please check your email to verify your account.',
      new UserResponseDto(user),
    );
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<MessageResponseDto> {
    const tokenHash = this.tokenService.hashToken(dto.token);
    const verificationToken = await this.prisma.verificationToken.findUnique({
      where: { tokenHash },
    });

    const isInvalid =
      !verificationToken ||
      verificationToken.usedAt !== null ||
      verificationToken.expiresAt < new Date();
    if (isInvalid) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: verificationToken.userId },
        data: { isVerified: true },
      }),
      this.prisma.verificationToken.update({
        where: { id: verificationToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return new MessageResponseDto('Email verified successfully');
  }

  async login(dto: LoginDto): Promise<LoginResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await this.passwordService.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Checked after the password compare, not before, so a wrong password
    // and an unverified account return indistinguishable timing/behavior up
    // to this point - avoids leaking verification status to a guesser.
    if (!user.isVerified) {
      throw new ForbiddenException(
        'Please verify your email before logging in',
      );
    }

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const {
      token: refreshToken,
      tokenHash,
      expiresAt,
    } = this.tokenService.generateRefreshToken();
    await this.prisma.refreshToken.create({
      data: { userId: user.id, hashedToken: tokenHash, expiresAt },
    });

    return { accessToken, refreshToken, user: new UserResponseDto(user) };
  }

  async getCurrentUser(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }
    return new UserResponseDto(user);
  }
}
