import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { EmailService } from './services/email.service';
import { SessionService, SessionMetadata } from './services/session.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

// Generic response for the resend-verification endpoint. Identical wording
// regardless of whether the account exists or is already verified - the
// point is to give an attacker probing emails nothing to distinguish on.
const RESEND_VERIFICATION_MESSAGE =
  "An account exists for this email, we've sent a verification link.";

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
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly sessionService: SessionService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    const { token, tokenHash, expiresAt } =
      this.tokenService.generateVerificationToken();

    // User + verification token are committed together. Sending the email
    // happens only after the commit and is deliberately excluded from the
    // transaction: an SMTP failure must never roll back account creation,
    // since that would leave the email address permanently unable to
    // register again (see resendVerification for the recovery path).
    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: { name: dto.name, email: dto.email, passwordHash },
      });
      await tx.verificationToken.create({
        data: { userId: createdUser.id, tokenHash, expiresAt },
      });
      return createdUser;
    });

    const emailSent = await this.trySendVerificationEmail(user.email, token);
    const message = emailSent
      ? 'Registration successful. Please check your email to verify your account.'
      : "Your account has been created, but we couldn't send the verification email. Please request another verification email.";

    return new RegisterResponseDto(message, new UserResponseDto(user));
  }

  async resendVerification(
    dto: ResendVerificationDto,
  ): Promise<MessageResponseDto> {
    const genericResponse = new MessageResponseDto(RESEND_VERIFICATION_MESSAGE);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    // Same generic response whether the account doesn't exist or is already
    // verified - both branches must be indistinguishable to the caller.
    if (!user || user.isVerified) {
      return genericResponse;
    }

    const { token, tokenHash, expiresAt } =
      this.tokenService.generateVerificationToken();

    await this.prisma.$transaction(async (tx) => {
      await tx.verificationToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() },
      });
      await tx.verificationToken.create({
        data: { userId: user.id, tokenHash, expiresAt },
      });
    });

    await this.trySendVerificationEmail(user.email, token);

    return genericResponse;
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

  async login(
    dto: LoginDto,
    meta: SessionMetadata,
    existingRefreshToken?: string,
  ): Promise<LoginResult> {
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

    const { accessToken, refreshToken } =
      await this.sessionService.createSession(user, meta, existingRefreshToken);

    return { accessToken, refreshToken, user: new UserResponseDto(user) };
  }

  async getCurrentUser(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }
    return new UserResponseDto(user);
  }

  // Isolates the "email delivery is best-effort, not transactional" contract
  // shared by register and resendVerification: the caller's DB work has
  // already committed by the time this runs, so a failure here is logged and
  // swallowed rather than surfaced as a 500 - EmailService's own
  // InternalServerErrorException never leaks past this point.
  private async trySendVerificationEmail(
    email: string,
    token: string,
  ): Promise<boolean> {
    try {
      await this.emailService.sendVerificationEmail(email, token);
      return true;
    } catch (error) {
      this.logger.error(
        `Verification email delivery failed for ${email}: ${(error as Error).message}`,
      );
      return false;
    }
  }
}
