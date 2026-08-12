import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { GithubController } from './github.controller';
import { GithubApiService } from './services/github-api.service';
import { GithubOAuthService } from './services/github-oauth.service';
import { GithubRepositoryService } from './services/github-repository.service';

@Module({
  imports: [
    DatabaseModule,
    PortfolioModule,
    // Reuses AuthModule's JwtModule (same secret as session access tokens)
    // to sign/verify the short-lived OAuth `state` param - see
    // GithubOAuthService. This is not a login/session mechanism, just a way
    // to carry the authenticated user's id safely through GitHub's redirect.
    AuthModule,
  ],
  controllers: [GithubController],
  providers: [GithubApiService, GithubOAuthService, GithubRepositoryService],
})
export class GithubModule {}
