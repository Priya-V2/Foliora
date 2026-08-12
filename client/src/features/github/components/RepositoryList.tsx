"use client";

import { FolderGit2 } from "lucide-react";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { GithubRepository } from "@/types/github.types";
import RepositoryRow from "./RepositoryRow";

type RepositoriesStatus = "idle" | "loading" | "success" | "error";

interface RepositoryListProps {
  status: RepositoriesStatus;
  repositories: GithubRepository[];
  error: string | null;
  selectedRepoIds: Set<number>;
  onToggle: (repoId: number) => void;
  onRetry: () => void;
}

export default function RepositoryList({
  status,
  repositories,
  error,
  selectedRepoIds,
  onToggle,
  onRetry,
}: RepositoryListProps) {
  return (
    <div className="border-t border-border pt-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-text">
          Choose repositories to showcase
        </p>
        {status === "success" && (
          <span className="text-xs text-textMuted">{repositories.length} found</span>
        )}
      </div>

      {status === "loading" && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-6 text-center">
          <p className="text-sm text-danger">{error}</p>
          <Button variant="secondary" className="mt-4" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}

      {status === "success" && repositories.length === 0 && (
        <EmptyState
          icon={FolderGit2}
          title="No public repositories found"
          description="We couldn't find any public repositories on this GitHub account."
          action={
            <Button variant="secondary" onClick={onRetry}>
              Refresh
            </Button>
          }
        />
      )}

      {status === "success" && repositories.length > 0 && (
        <div className="space-y-2">
          {repositories.map((repository) => (
            <RepositoryRow
              key={repository.id}
              repository={repository}
              checked={selectedRepoIds.has(repository.repoId)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
