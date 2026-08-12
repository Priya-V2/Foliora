import api from "@/lib/api";
import {
  GithubRepository,
  GithubStatus,
  ImportedProject,
} from "@/types/github.types";

async function getConnectUrl(): Promise<string> {
  const { data } = await api.get<{ url: string }>("/github/connect");
  return data.url;
}

async function getStatus(): Promise<GithubStatus> {
  const { data } = await api.get<GithubStatus>("/github/status");
  return data;
}

async function getRepositories(): Promise<GithubRepository[]> {
  const { data } = await api.get<GithubRepository[]>("/github/repositories");
  return data;
}

async function importRepositories(
  repoIds: number[],
): Promise<ImportedProject[]> {
  const { data } = await api.post<ImportedProject[]>(
    "/github/repositories/import",
    { repoIds },
  );
  return data;
}

const githubService = {
  getConnectUrl,
  getStatus,
  getRepositories,
  importRepositories,
};

export default githubService;
