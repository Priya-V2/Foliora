import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { GithubStatusResponseDto } from '../dto/github-status-response.dto';
import { encryptToken } from '../utils/token-cipher.util';
import { GithubApiService } from './github-api.service';

const STATE_PURPOSE = 'github-connect';
const STATE_TTL = '10m';

interface GithubConnectStatePayload {
  sub: string;
  purpose: typeof STATE_PURPOSE;
}

// Orchestrates the "Connect GitHub" handshake: mints the redirect + a
// short-lived signed `state` (reusing AuthModule's JwtService/secret - see
// auth.module.ts), then on callback verifies it, exchanges the code, and
// upserts GithubConnection. Deliberately separate from AuthModule's own
// JwtStrategy: this is a one-time "link an external account for read
// access" handshake, not a session/login mechanism.
@Injectable()
export class GithubOAuthService {
  private readonly logger = new Logger(GithubOAuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly githubApi: GithubApiService,
  ) {}

  buildConnectUrl(userId: string): string {
    const state = this.jwtService.sign(
      {
        sub: userId,
        purpose: STATE_PURPOSE,
      } satisfies GithubConnectStatePayload,
      { expiresIn: STATE_TTL },
    );
    return this.githubApi.buildAuthorizeUrl(state);
  }

  // Resolves to a frontend URL in every case (success or failure) so the
  // controller can always just redirect the browser there - a malformed or
  // expired callback should never leave the user stranded on a bare error
  // page mid-onboarding.
  async handleCallback(params: {
    code?: string;
    state?: string;
    error?: string;
  }): Promise<string> {
    const onboardingUrl = this.getOnboardingReturnUrl();

    if (params.error) {
      this.logger.warn(`GitHub OAuth was denied or errored: ${params.error}`);
      return `${onboardingUrl}?github=error`;
    }

    if (!params.code || !params.state) {
      return `${onboardingUrl}?github=error`;
    }

    const userId = this.verifyState(params.state);
    if (!userId) {
      return `${onboardingUrl}?github=error`;
    }

    try {
      await this.connectAccount(userId, params.code);
      return `${onboardingUrl}?github=connected`;
    } catch (error) {
      this.logger.error(
        `GitHub OAuth callback failed for user ${userId}: ${(error as Error).message}`,
      );
      return `${onboardingUrl}?github=error`;
    }
  }

  async getStatus(userId: string): Promise<GithubStatusResponseDto> {
    const connection = await this.prisma.githubConnection.findUnique({
      where: { userId },
    });
    return new GithubStatusResponseDto(connection);
  }

  private verifyState(state: string): string | null {
    try {
      const payload = this.jwtService.verify<GithubConnectStatePayload>(state);
      if (payload.purpose !== STATE_PURPOSE || !payload.sub) {
        return null;
      }
      return payload.sub;
    } catch {
      this.logger.warn(
        'GitHub OAuth callback received an invalid or expired state token',
      );
      return null;
    }
  }

  private async connectAccount(userId: string, code: string): Promise<void> {
    const accessToken = await this.githubApi.exchangeCodeForToken(code);
    const profile = await this.githubApi.fetchAuthenticatedProfile(accessToken);
    const encryptionKey = this.configService.getOrThrow<string>(
      'github.tokenEncryptionKey',
    );
    const accessTokenEncrypted = encryptToken(accessToken, encryptionKey);

    await this.prisma.githubConnection.upsert({
      where: { userId },
      create: {
        userId,
        githubId: profile.githubId,
        username: profile.username,
        avatar: profile.avatar,
        accessTokenEncrypted,
      },
      update: {
        githubId: profile.githubId,
        username: profile.username,
        avatar: profile.avatar,
        accessTokenEncrypted,
      },
    });
  }

  private getOnboardingReturnUrl(): string {
    const frontendUrl =
      this.configService.getOrThrow<string>('auth.frontendUrl');
    return `${frontendUrl}/onboarding/github`;
  }
}
