"use client";

import { CheckCircle2 } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { GithubStatus } from "@/types/github.types";

type ConnectionStatus = "loading" | "connected" | "disconnected" | "error";

interface GithubConnectPanelProps {
  status: ConnectionStatus;
  profile: GithubStatus | null;
  error: string | null;
  isConnecting: boolean;
  onConnect: () => void;
  onRetry: () => void;
  onSkip: () => void;
}

export default function GithubConnectPanel({
  status,
  profile,
  error,
  isConnecting,
  onConnect,
  onRetry,
  onSkip,
}: GithubConnectPanelProps) {
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-11 w-full max-w-xs rounded-md" />
      </div>
    );
  }

  if (status === "connected" && profile) {
    return (
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        {/* <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success"
          aria-hidden="true"
        > */}
        <CheckCircle2
          size={28}
          className="text-success h-10 lg:h-12 w-10 lg:w-12"
        />
        {/* </div> */}
        <div>
          <p className="text-lg font-semibold text-text">Connected to GitHub</p>
          <p className="mt-1 text-sm text-textMuted">
            Connected as{" "}
            <span className="font-medium text-text">@{profile.username}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-2 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-text text-white"
        aria-hidden="true"
      >
        <FaGithub size={28} />
      </div>

      <div>
        <p className="text-lg font-semibold text-text">Import from GitHub</p>
        <p className="mt-1 text-sm text-textMuted">
          Import repositories into your portfolio automatically.
        </p>
      </div>

      {status === "error" && error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <div className="flex w-full max-w-xs flex-col items-center gap-3">
        <Button
          fullWidth
          onClick={status === "error" ? onRetry : onConnect}
          isLoading={isConnecting}
        >
          {!isConnecting && <FaGithub size={16} aria-hidden="true" />}
          {isConnecting
            ? "Connecting..."
            : status === "error"
              ? "Try Again"
              : "Connect GitHub"}
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="rounded text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
