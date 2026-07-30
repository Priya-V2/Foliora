import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from '../database/database.module';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { CookieService } from './services/cookie.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('auth.jwt.accessSecret'),
        signOptions: {
          expiresIn: configService.getOrThrow<number>(
            'auth.jwt.accessExpiresInSeconds',
          ),
        },
      }),
    }),
    // Scoped to this module: future register/login/reset controllers opt in
    // via @UseGuards(ThrottlerGuard), it is not applied app-wide.
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.getOrThrow<number>('auth.rateLimit.ttlMs'),
            limit: configService.getOrThrow<number>('auth.rateLimit.limit'),
          },
        ],
      }),
    }),
  ],
  providers: [PasswordService, TokenService, CookieService, JwtStrategy],
  exports: [
    PasswordService,
    TokenService,
    CookieService,
    JwtModule,
    PassportModule,
    ThrottlerModule,
  ],
})
export class AuthModule {}
