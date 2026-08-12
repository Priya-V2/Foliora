import { ApiProperty } from '@nestjs/swagger';
import { GithubRepository } from '../../generated/prisma';

export class GithubRepositoryResponseDto {
  @ApiProperty({ description: 'GithubRepository cache row id' })
  id: string;

  @ApiProperty({ description: "GitHub's own repository id" })
  repoId: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ nullable: true })
  language: string | null;

  @ApiProperty()
  stars: number;

  @ApiProperty()
  forks: number;

  @ApiProperty()
  openIssues: number;

  @ApiProperty()
  watchers: number;

  @ApiProperty()
  url: string;

  @ApiProperty({ nullable: true })
  homepage: string | null;

  @ApiProperty({ nullable: true })
  pushedAt: Date | null;

  @ApiProperty({ nullable: true })
  githubUpdatedAt: Date | null;

  @ApiProperty()
  selected: boolean;

  constructor(repo: GithubRepository) {
    this.id = repo.id;
    this.repoId = repo.repoId;
    this.name = repo.name;
    this.description = repo.description;
    this.language = repo.language;
    this.stars = repo.stars;
    this.forks = repo.forks;
    this.openIssues = repo.openIssues;
    this.watchers = repo.watchers;
    this.url = repo.url;
    this.homepage = repo.homepage;
    this.pushedAt = repo.pushedAt;
    this.githubUpdatedAt = repo.githubUpdatedAt;
    this.selected = repo.selected;
  }
}
