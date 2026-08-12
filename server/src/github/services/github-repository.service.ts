import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { GithubConnection } from '../../generated/prisma';
import { PortfolioService } from '../../portfolio/portfolio.service';
import { ProjectResponseDto } from '../../portfolio/dto/project.dto';
import { GithubRepositoryResponseDto } from '../dto/github-repository-response.dto';
import { GithubRepoPayload } from '../types/github-api.types';
import { deriveTechStack } from '../utils/tech-stack.util';
import { mapRepositoryToProjectDto } from '../utils/project-mapper.util';
import { decryptToken } from '../utils/token-cipher.util';
import { GithubApiService } from './github-api.service';

function toRepoFields(repo: GithubRepoPayload) {
  return {
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stars: repo.stars,
    forks: repo.forks,
    openIssues: repo.openIssues,
    watchers: repo.watchers,
    url: repo.url,
    homepage: repo.homepage,
    githubCreatedAt: repo.githubCreatedAt,
    githubUpdatedAt: repo.githubUpdatedAt,
    pushedAt: repo.pushedAt,
  };
}

// Owns everything downstream of "the user has a GithubConnection": syncing
// the repository cache from GitHub, persisting the picker's selection, and
// importing selected repos into Project rows. GithubOAuthService owns the
// handshake that creates the connection in the first place.
@Injectable()
export class GithubRepositoryService {
  private readonly logger = new Logger(GithubRepositoryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly githubApi: GithubApiService,
    private readonly portfolioService: PortfolioService,
  ) {}

  async listRepositories(
    userId: string,
  ): Promise<GithubRepositoryResponseDto[]> {
    const connection = await this.requireConnection(userId);
    const accessToken = this.decryptAccessToken(connection);

    const remoteRepos = await this.githubApi.listPublicRepositories(
      connection.username,
      accessToken,
    );

    const synced =
      remoteRepos.length === 0
        ? []
        : await this.prisma.$transaction(
            remoteRepos.map((repo) =>
              this.prisma.githubRepository.upsert({
                where: { repoId: repo.repoId },
                create: {
                  githubConnectionId: connection.id,
                  repoId: repo.repoId,
                  ...toRepoFields(repo),
                },
                // `selected` is intentionally left untouched here so a
                // repeat sync doesn't wipe out the user's prior choice.
                update: toRepoFields(repo),
              }),
            ),
          );

    // Repos that disappeared upstream (renamed/deleted/made private)
    // shouldn't linger in the picker - see schema.prisma's cache-model note.
    await this.prisma.githubRepository.deleteMany({
      where: {
        githubConnectionId: connection.id,
        repoId: { notIn: remoteRepos.map((repo) => repo.repoId) },
      },
    });

    await this.prisma.githubConnection.update({
      where: { id: connection.id },
      data: { lastSyncedAt: new Date() },
    });

    return synced.map((repo) => new GithubRepositoryResponseDto(repo));
  }

  // Persists the picker's selection and imports the selected repos as
  // Project records in one call (see onboarding "Continue" behavior: there
  // is no separate save-selection step, Continue is the save). Re-importing
  // an already-imported repo updates its existing Project instead of
  // duplicating it (Project.sourceRepositoryId is the dedupe key).
  async importSelectedRepositories(
    userId: string,
    repoIds: number[],
  ): Promise<ProjectResponseDto[]> {
    const connection = await this.requireConnection(userId);

    await this.prisma.$transaction([
      this.prisma.githubRepository.updateMany({
        where: { githubConnectionId: connection.id },
        data: { selected: false },
      }),
      this.prisma.githubRepository.updateMany({
        where: { githubConnectionId: connection.id, repoId: { in: repoIds } },
        data: { selected: true },
      }),
    ]);

    if (repoIds.length === 0) {
      return [];
    }

    const repos = await this.prisma.githubRepository.findMany({
      where: { githubConnectionId: connection.id, repoId: { in: repoIds } },
    });

    const accessToken = this.decryptAccessToken(connection);
    const projects: ProjectResponseDto[] = [];

    for (const repo of repos) {
      const languages = await this.githubApi.fetchLanguages(
        connection.username,
        repo.name,
        accessToken,
      );
      const techStack = deriveTechStack(repo.language, languages);

      await this.prisma.githubRepository.update({
        where: { id: repo.id },
        data: { languages, techStack },
      });

      const dto = mapRepositoryToProjectDto({ ...repo, techStack });

      const existingProject = await this.prisma.project.findFirst({
        where: { sourceRepositoryId: repo.id, deletedAt: null },
      });

      const project = existingProject
        ? await this.portfolioService.updateProject(
            userId,
            existingProject.id,
            dto,
          )
        : await this.createImportedProject(userId, repo.id, dto);

      projects.push(project);
    }

    return projects;
  }

  private async createImportedProject(
    userId: string,
    sourceRepositoryId: string,
    dto: ReturnType<typeof mapRepositoryToProjectDto>,
  ): Promise<ProjectResponseDto> {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new NotFoundException(
        'Please review your parsed resume data before importing GitHub projects.',
      );
    }

    const displayOrder = await this.prisma.project.count({
      where: { portfolioId: portfolio.id, deletedAt: null },
    });

    const project = await this.prisma.project.create({
      data: {
        portfolioId: portfolio.id,
        title: dto.title,
        description: dto.description,
        techStack: dto.techStack ?? [],
        githubUrl: dto.githubUrl,
        demoUrl: dto.demoUrl,
        featured: false,
        displayOrder,
        sourceRepositoryId,
      },
    });

    return new ProjectResponseDto(project);
  }

  private async requireConnection(userId: string): Promise<GithubConnection> {
    const connection = await this.prisma.githubConnection.findUnique({
      where: { userId },
    });

    if (!connection) {
      throw new NotFoundException('Connect your GitHub account first.');
    }

    return connection;
  }

  private decryptAccessToken(connection: GithubConnection): string {
    const key = this.configService.getOrThrow<string>(
      'github.tokenEncryptionKey',
    );
    return decryptToken(connection.accessTokenEncrypted, key);
  }
}
