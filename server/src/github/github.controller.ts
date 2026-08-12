import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { CurrentUserData } from '../auth/types/current-user.interface';
import { ProjectResponseDto } from '../portfolio/dto/project.dto';
import { GithubRepositoryResponseDto } from './dto/github-repository-response.dto';
import { GithubStatusResponseDto } from './dto/github-status-response.dto';
import { ImportRepositoriesDto } from './dto/import-repositories.dto';
import { GithubOAuthService } from './services/github-oauth.service';
import { GithubRepositoryService } from './services/github-repository.service';

@ApiTags('github')
@Controller('github')
export class GithubController {
  constructor(
    private readonly oauthService: GithubOAuthService,
    private readonly repositoryService: GithubRepositoryService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('connect')
  connect(@CurrentUser() user: CurrentUserData): { url: string } {
    return { url: this.oauthService.buildConnectUrl(user.id) };
  }

  // Reached by the browser via GitHub's redirect, not by our own frontend -
  // there is no Authorization header to guard on here. Identity is carried
  // through the signed `state` param minted by GET /github/connect instead.
  @Get('callback')
  async callback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const redirectUrl = await this.oauthService.handleCallback({
      code,
      state,
      error,
    });
    res.redirect(redirectUrl);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('status')
  getStatus(
    @CurrentUser() user: CurrentUserData,
  ): Promise<GithubStatusResponseDto> {
    return this.oauthService.getStatus(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('repositories')
  listRepositories(
    @CurrentUser() user: CurrentUserData,
  ): Promise<GithubRepositoryResponseDto[]> {
    return this.repositoryService.listRepositories(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('repositories/import')
  importRepositories(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: ImportRepositoriesDto,
  ): Promise<ProjectResponseDto[]> {
    return this.repositoryService.importSelectedRepositories(
      user.id,
      dto.repoIds,
    );
  }
}
