import { GithubRepoPayload, RawGithubRepo } from '../types/github-api.types';

export function mapRawRepo(raw: RawGithubRepo): GithubRepoPayload {
  return {
    repoId: raw.id,
    name: raw.name,
    description: raw.description,
    language: raw.language,
    stars: raw.stargazers_count,
    forks: raw.forks_count,
    openIssues: raw.open_issues_count,
    watchers: raw.watchers_count,
    url: raw.html_url,
    homepage: raw.homepage || null,
    githubCreatedAt: raw.created_at ? new Date(raw.created_at) : null,
    githubUpdatedAt: raw.updated_at ? new Date(raw.updated_at) : null,
    pushedAt: raw.pushed_at ? new Date(raw.pushed_at) : null,
  };
}
