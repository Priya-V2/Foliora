import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';

// Controllers never build cookie options by hand — every refresh-token
// cookie read/write goes through this service so dev/prod behavior
// (Secure, SameSite, domain) stays consistent in one place.
@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie(
      this.getCookieName(),
      refreshToken,
      this.getCookieOptions(this.getMaxAgeMs()),
    );
  }

  clearRefreshTokenCookie(res: Response): void {
    res.clearCookie(this.getCookieName(), this.getCookieOptions());
  }

  private getCookieName(): string {
    return this.configService.getOrThrow<string>(
      'auth.refreshToken.cookieName',
    );
  }

  private getMaxAgeMs(): number {
    const expiresInDays = this.configService.getOrThrow<number>(
      'auth.refreshToken.expiresInDays',
    );
    return expiresInDays * 24 * 60 * 60 * 1000;
  }

  private getCookieOptions(maxAge?: number): CookieOptions {
    return {
      httpOnly: true,
      secure: this.configService.getOrThrow<boolean>('auth.cookie.secure'),
      sameSite: 'lax',
      domain: this.configService.get<string>('auth.cookie.domain'),
      path: '/',
      ...(maxAge !== undefined && { maxAge }),
    };
  }
}
