import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';
import { CurrentUserData } from '../types/current-user.interface';
import { JwtPayload } from '../types/jwt-payload.interface';

// Validates every access token on protected routes. Re-checking the user
// against the database (rather than trusting the payload alone) means a
// deleted account is locked out immediately instead of staying valid until
// its token naturally expires.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('auth.jwt.accessSecret'),
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUserData> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, deletedAt: true },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    return { id: user.id, email: user.email, role: user.role };
  }
}
