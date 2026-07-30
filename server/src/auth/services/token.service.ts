import { randomBytes, createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types/jwt-payload.interface';

export interface GeneratedToken {
  /** Raw, high-entropy token — sent to the client, never persisted as-is. */
  token: string;
  /** SHA-256 hash of `token` — what actually gets stored in the database. */
  tokenHash: string;
  expiresAt: Date;
}

// Every token-related operation lives here so future features (login,
// refresh rotation, email verification, password reset, OAuth) reuse one
// source of truth instead of hand-rolling JWT signing or crypto calls.
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  verifyAccessToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }

  generateRefreshToken(): GeneratedToken {
    const expiresInDays = this.configService.getOrThrow<number>(
      'auth.refreshToken.expiresInDays',
    );
    return this.generateOpaqueToken(daysFromNow(expiresInDays));
  }

  generateVerificationToken(): GeneratedToken {
    const expiresInHours = this.configService.getOrThrow<number>(
      'auth.verificationToken.expiresInHours',
    );
    return this.generateOpaqueToken(hoursFromNow(expiresInHours));
  }

  generatePasswordResetToken(): GeneratedToken {
    const expiresInMinutes = this.configService.getOrThrow<number>(
      'auth.passwordResetToken.expiresInMinutes',
    );
    return this.generateOpaqueToken(minutesFromNow(expiresInMinutes));
  }

  /** SHA-256 hex digest — how a raw incoming token is looked up against a stored hash. */
  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private generateOpaqueToken(expiresAt: Date): GeneratedToken {
    const token = randomBytes(32).toString('hex');
    return { token, tokenHash: this.hashToken(token), expiresAt };
  }
}

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function hoursFromNow(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

function minutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
