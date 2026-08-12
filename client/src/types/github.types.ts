export interface GithubStatus {
  connected: boolean;
  username: string | null;
  avatar: string | null;
  connectedAt: string | null;
  lastSyncedAt: string | null;
}

export interface GithubRepository {
  /** GithubRepository cache row id - stable key for selection/list rendering. */
  id: string;
  /** GitHub's own repository id - what the import endpoint expects. */
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
  pushedAt: string | null;
  githubUpdatedAt: string | null;
  selected: boolean;
}

export interface ImportedProject {
  id: string;
  title: string;
  description: string | null;
  techStack: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  displayOrder: number;
}
