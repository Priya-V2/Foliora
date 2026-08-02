import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { TokenService } from './token.service';
import { UserRole } from '../../generated/prisma';

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
}

// Best-effort request metadata recorded against a session for auditing; never
// used to authorize a request.
export interface SessionMetadata {
  ipAddress?: string;
  userAgent?: string;
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

// Owns the refresh-token session lifecycle (create, rotate, revoke) so this
// logic doesn't spread across AuthService and AuthController, per the
// Milestone 3 architecture brief. AuthService still owns credential
// validation (register/login/verify); this service owns everything about
// what happens to a session once credentials are accepted.
@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  // Called on successful login. `existingRefreshToken` is whatever refresh
  // cookie the browser presented alongside the login request, if any - it
  // identifies "this device's" prior session. Revoking it before creating the
  // new one enforces one active session per device without inventing a
  // separate device-fingerprinting mechanism: the refresh cookie itself is
  // the only durable device identifier the current architecture has.
  async createSession(
    user: SessionUser,
    meta: SessionMetadata,
    existingRefreshToken?: string,
  ): Promise<SessionTokens> {
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
    const sessionCreatedAt = new Date();

    await this.prisma.$transaction(async (tx) => {
      if (existingRefreshToken) {
        const hashedExisting =
          this.tokenService.hashToken(existingRefreshToken);
        // Scoped to this user + not-already-revoked: never touches another
        // user's session (shared browser) or re-revokes an already-dead row.
        await tx.refreshToken.updateMany({
          where: {
            userId: user.id,
            hashedToken: hashedExisting,
            revokedAt: null,
          },
          data: { revokedAt: new Date() },
        });
      }

      await tx.refreshToken.create({
        data: {
          userId: user.id,
          hashedToken: tokenHash,
          expiresAt,
          sessionCreatedAt,
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
        },
      });
    });

    return { accessToken, refreshToken };
  }

  // Implements the refresh workflow from the Milestone 3 brief: validate,
  // detect reuse, enforce absolute session lifetime, then rotate.
  async rotateSession(
    rawRefreshToken: string,
    meta: SessionMetadata,
  ): Promise<SessionTokens> {
    const hashedToken = this.tokenService.hashToken(rawRefreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { hashedToken },
      include: { user: true },
    });

    if (!stored || !stored.user || stored.user.deletedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (stored.revokedAt) {
      // Only a token that was revoked *by rotation* (replacedByTokenId set)
      // signals theft: the sole legitimate holder of that token already
      // exchanged it for its successor, so a second presentation must be an
      // attacker replaying a stolen copy. A token revoked for any other
      // reason (logout, or login replacing this device's prior session) was
      // never expected to be presented again by anyone legitimate either,
      // but treating THAT as theft would let one stale tab's request nuke a
      // brand-new, legitimate session it raced against.
      if (stored.replacedByTokenId) {
        await this.revokeAllUserSessions(stored.userId);
        throw new UnauthorizedException(
          'Refresh token reuse detected; all sessions have been revoked. Please log in again.',
        );
      }
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const absoluteLifetimeMs =
      this.configService.getOrThrow<number>(
        'auth.refreshToken.absoluteLifetimeDays',
      ) *
      24 *
      60 *
      60 *
      1000;
    const sessionAgeMs = Date.now() - stored.sessionCreatedAt.getTime();
    if (sessionAgeMs > absoluteLifetimeMs) {
      await this.prisma.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException(
        'Session has exceeded its maximum lifetime. Please log in again.',
      );
    }

    const accessToken = this.tokenService.generateAccessToken({
      sub: stored.user.id,
      email: stored.user.email,
      role: stored.user.role,
    });
    const {
      token: newRefreshToken,
      tokenHash: newHashedToken,
      expiresAt: newExpiresAt,
    } = this.tokenService.generateRefreshToken();

    await this.prisma.$transaction(async (tx) => {
      const newToken = await tx.refreshToken.create({
        data: {
          userId: stored.userId,
          hashedToken: newHashedToken,
          expiresAt: newExpiresAt,
          // Carried forward, not reset - this is what makes the absolute
          // lifetime check above measure the whole session, not just the
          // most recent rotation.
          sessionCreatedAt: stored.sessionCreatedAt,
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
        },
      });

      await tx.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date(), replacedByTokenId: newToken.id },
      });
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  // Idempotent by design: logging out twice, or logging out with a
  // token that's already gone, both succeed silently.
  async revokeSession(rawRefreshToken: string): Promise<void> {
    const hashedToken = this.tokenService.hashToken(rawRefreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { hashedToken, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async revokeAllUserSessions(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
