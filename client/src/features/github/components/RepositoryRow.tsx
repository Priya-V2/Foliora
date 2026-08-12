"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { GithubRepository } from "@/types/github.types";
import { formatRelativeTime } from "../utils/formatRelativeTime";
import { getLanguageColor } from "../utils/languageColor";

interface RepositoryRowProps {
  repository: GithubRepository;
  checked: boolean;
  onToggle: (repoId: number) => void;
}

// A native checkbox wrapped in its own <label> - keyboard/screen-reader
// accessible for free, and selection is communicated by the checkbox state
// itself (not just the border/background tint) so it isn't color-only.
export default function RepositoryRow({
  repository,
  checked,
  onToggle,
}: RepositoryRowProps) {
  const checkboxId = `github-repo-${repository.id}`;

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        "flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-surfaceAlt",
        checked && "border-primary/40 bg-primary/5",
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(repository.repoId)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text">
            {repository.name}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-textMuted">
            {repository.language && (
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: getLanguageColor(repository.language) }}
                  aria-hidden="true"
                />
                {repository.language}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Star size={12} aria-hidden="true" />
              {repository.stars}
            </span>
          </div>
        </div>
      </div>

      <span className="shrink-0 whitespace-nowrap text-xs text-textMuted">
        Updated {formatRelativeTime(repository.pushedAt ?? repository.githubUpdatedAt)}
      </span>
    </label>
  );
}
