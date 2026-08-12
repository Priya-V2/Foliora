import { ShieldCheck } from "lucide-react";

export default function GithubPrivacyNote() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-surfaceAlt px-4 py-3">
      <ShieldCheck
        size={18}
        className="mt-0.5 shrink-0 text-primary"
        aria-hidden="true"
      />
      <p className="text-xs text-textMuted">
        <span className="font-semibold text-text">Privacy: </span>
        Only public repositories are accessed. Secure OAuth authentication.
        Disconnect anytime.
      </p>
    </div>
  );
}
