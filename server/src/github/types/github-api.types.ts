// Shapes for the slice of GitHub's REST API this integration uses. Kept
// local to GithubApiService - the only file allowed to talk to GitHub - so
// the rest of the module only ever sees our own normalized types.

export interface GithubProfile {
  githubId: number;
  username: string;
  avatar: string | null;
}

export interface GithubRepoPayload {
  repoId: number;
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  url: string;
  homepage: string | null;
  githubCreatedAt: Date | null;
  githubUpdatedAt: Date | null;
  pushedAt: Date | null;
}

// Only the fields this integration reads from GitHub's repo list response
// (https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user).
export interface RawGithubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  html_url: string;
  homepage: string | null;
  created_at: string | null;
  updated_at: string | null;
  pushed_at: string | null;
  private: boolean;
}
