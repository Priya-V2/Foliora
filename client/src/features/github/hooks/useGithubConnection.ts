"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import githubService from "@/services/github.service";
import { GithubRepository, GithubStatus } from "@/types/github.types";
import { getErrorMessage } from "@/utils/getErrorMessage";

type ConnectionStatus = "loading" | "connected" | "disconnected" | "error";
type RepositoriesStatus = "idle" | "loading" | "success" | "error";

// Where "Skip for now" and a successful "Continue" both land - Choose
// Template/Preview Portfolio (steps 4-5) don't exist yet, so this points at
// the existing ComingSoonPlaceholder that Review Parsed Data already used to
// continue to (see docs: this feature inserts itself as the real step 3
// between Review and that placeholder).
const NEXT_STEP_ROUTE = "/onboarding/resume/enhance";
const GITHUB_STEP_ROUTE = "/onboarding/github";

// Owns the Connect GitHub screen's state end-to-end: connection status,
// repository fetch, local checkbox selection, and the connect/skip/continue
// actions. Page-local (no Redux slice) since no other screen reads this
// data - same justification as usePortfolioReview for Review Parsed Data.
export function useGithubConnection() {
  const router = useRouter();

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("loading");
  const [profile, setProfile] = useState<GithubStatus | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const [repositories, setRepositories] = useState<GithubRepository[]>([]);
  const [repositoriesStatus, setRepositoriesStatus] = useState<RepositoriesStatus>("idle");
  const [repositoriesError, setRepositoriesError] = useState<string | null>(null);
  const [selectedRepoIds, setSelectedRepoIds] = useState<Set<number>>(new Set());

  const [isContinuing, setIsContinuing] = useState(false);

  const fetchRepositories = useCallback(async () => {
    setRepositoriesStatus("loading");
    setRepositoriesError(null);
    try {
      const repos = await githubService.getRepositories();
      setRepositories(repos);
      setSelectedRepoIds(
        new Set(repos.filter((repo) => repo.selected).map((repo) => repo.repoId)),
      );
      setRepositoriesStatus("success");
    } catch (err) {
      setRepositoriesStatus("error");
      setRepositoriesError(
        getErrorMessage(err, "We couldn't load your repositories."),
      );
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    setConnectionStatus("loading");
    setConnectionError(null);
    try {
      const status = await githubService.getStatus();
      setProfile(status);
      setConnectionStatus(status.connected ? "connected" : "disconnected");
      if (status.connected) {
        void fetchRepositories();
      }
    } catch (err) {
      setConnectionStatus("error");
      setConnectionError(
        getErrorMessage(err, "We couldn't check your GitHub connection."),
      );
    }
  }, [fetchRepositories]);

  useEffect(() => {
    // Deferred via setTimeout so the initial setState calls inside
    // fetchStatus() happen outside the effect's synchronous body (avoids
    // cascading renders on mount - see react-hooks/set-state-in-effect,
    // same pattern as useResumeParsing.ts / usePortfolioReview.ts).
    const timeoutId = setTimeout(() => {
      void fetchStatus();
    }, 0);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The backend OAuth callback redirects the full browser back here with
  // `?github=connected` or `?github=error` (GithubOAuthService.handleCallback)
  // after the GitHub authorize/callback round-trip. Read it once client-side
  // via window.location rather than useSearchParams(), which would force
  // this page into a Suspense boundary just to read a one-time flag.
  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get("github");
    if (!result) return;

    const timeoutId = setTimeout(() => {
      if (result === "connected") {
        toast.success("GitHub connected successfully.");
        void fetchStatus();
      } else if (result === "error") {
        toast.error("We couldn't connect your GitHub account. Please try again.");
      }
    }, 0);

    router.replace(GITHUB_STEP_ROUTE);
    return () => clearTimeout(timeoutId);
    // Intentionally runs once on mount to consume the redirect result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function connectGithub() {
    setIsConnecting(true);
    try {
      const url = await githubService.getConnectUrl();
      window.location.href = url;
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          "We couldn't start the GitHub connection. Please try again.",
        ),
      );
      setIsConnecting(false);
    }
  }

  function toggleRepository(repoId: number) {
    setSelectedRepoIds((previous) => {
      const next = new Set(previous);
      if (next.has(repoId)) {
        next.delete(repoId);
      } else {
        next.add(repoId);
      }
      return next;
    });
  }

  function skip() {
    router.push(NEXT_STEP_ROUTE);
  }

  async function continueOnboarding() {
    if (connectionStatus !== "connected") {
      router.push(NEXT_STEP_ROUTE);
      return;
    }

    setIsContinuing(true);
    try {
      await githubService.importRepositories(Array.from(selectedRepoIds));
      router.push(NEXT_STEP_ROUTE);
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          "We couldn't save your selected repositories. Please try again.",
        ),
      );
      setIsContinuing(false);
    }
  }

  return {
    connectionStatus,
    profile,
    connectionError,
    isConnecting,
    connectGithub,
    retryConnection: fetchStatus,
    repositories,
    repositoriesStatus,
    repositoriesError,
    refetchRepositories: fetchRepositories,
    selectedRepoIds,
    toggleRepository,
    isContinuing,
    continueOnboarding,
    skip,
  };
}
