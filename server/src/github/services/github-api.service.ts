import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mapRawRepo } from '../utils/github-repo.mapper';
import {
  GithubProfile,
  GithubRepoPayload,
  RawGithubRepo,
} from '../types/github-api.types';

interface GithubOAuthAppConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

// The ONLY file in the codebase allowed to call github.com/api.github.com -
// every other GitHub-integration class talks to this service, never fetch()
// directly, mirroring GeminiProvider's role for the AI module. Requests only
// ever carry the `read:user` scope token minted by GithubOAuthService, so
// every endpoint called here is read-only by construction.
@Injectable()
export class GithubApiService {
  private readonly logger = new Logger(GithubApiService.name);

  constructor(private readonly configService: ConfigService) {}

  private getOAuthAppConfig(): GithubOAuthAppConfig {
    const clientId = this.configService.get<string>('github.oauth.clientId');
    const clientSecret = this.configService.get<string>(
      'github.oauth.clientSecret',
    );
    const callbackUrl = this.configService.get<string>(
      'github.oauth.callbackUrl',
    );

    if (!clientId || !clientSecret || !callbackUrl) {
      throw new ServiceUnavailableException(
        'GitHub integration is not configured yet. Please try again later.',
      );
    }

    return { clientId, clientSecret, callbackUrl };
  }

  buildAuthorizeUrl(state: string): string {
    const { clientId, callbackUrl } = this.getOAuthAppConfig();
    const scope =
      this.configService.get<string>('github.oauth.scope') ?? 'read:user';

    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', callbackUrl);
    url.searchParams.set('scope', scope);
    url.searchParams.set('state', state);
    url.searchParams.set('allow_signup', 'false');
    return url.toString();
  }

  async exchangeCodeForToken(code: string): Promise<string> {
    const { clientId, clientSecret, callbackUrl } = this.getOAuthAppConfig();

    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: callbackUrl,
        }),
      },
    );

    if (!response.ok) {
      this.logger.warn(
        `GitHub token exchange responded with status ${response.status}`,
      );
      throw new UnauthorizedException(
        'GitHub authorization failed. Please try connecting again.',
      );
    }

    const data = (await response.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (!data.access_token) {
      this.logger.warn(
        `GitHub token exchange returned no access token: ${data.error ?? 'unknown error'} - ${data.error_description ?? ''}`,
      );
      throw new UnauthorizedException(
        'GitHub authorization failed. Please try connecting again.',
      );
    }

    return data.access_token;
  }

  async fetchAuthenticatedProfile(accessToken: string): Promise<GithubProfile> {
    const response = await this.githubGet(
      'https://api.github.com/user',
      accessToken,
    );
    const data = (await response.json()) as {
      id: number;
      login: string;
      avatar_url: string | null;
    };

    return {
      githubId: data.id,
      username: data.login,
      avatar: data.avatar_url,
    };
  }

  // Public repos only: this endpoint returns a user's public repositories
  // regardless of the caller's scope, and our token never carries
  // `repo`/`public_repo` scope in the first place - see github.config.ts.
  async listPublicRepositories(
    username: string,
    accessToken: string,
  ): Promise<GithubRepoPayload[]> {
    const response = await this.githubGet(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=public&sort=updated&per_page=100`,
      accessToken,
    );
    const data = (await response.json()) as RawGithubRepo[];

    return data.filter((repo) => !repo.private).map(mapRawRepo);
  }

  // Best-effort: a languages lookup failing shouldn't fail the whole import,
  // it just means that repo's derived techStack falls back to its primary
  // language alone (see tech-stack.util.ts).
  async fetchLanguages(
    owner: string,
    repoName: string,
    accessToken: string,
  ): Promise<Record<string, number>> {
    try {
      const response = await this.githubGet(
        `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/languages`,
        accessToken,
      );
      return (await response.json()) as Record<string, number>;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch languages for ${owner}/${repoName}: ${(error as Error).message}`,
      );
      return {};
    }
  }

  private async githubGet(url: string, accessToken: string): Promise<Response> {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Foliora-App',
      },
    });

    if (response.status === 401) {
      throw new UnauthorizedException(
        'Your GitHub connection has expired. Please reconnect.',
      );
    }

    if (
      response.status === 403 &&
      response.headers.get('x-ratelimit-remaining') === '0'
    ) {
      throw new ServiceUnavailableException(
        'GitHub rate limit reached. Please try again in a few minutes.',
      );
    }

    if (!response.ok) {
      this.logger.warn(
        `GitHub API request to ${url} failed with status ${response.status}`,
      );
      throw new ServiceUnavailableException(
        'GitHub is temporarily unavailable. Please try again.',
      );
    }

    return response;
  }
}
