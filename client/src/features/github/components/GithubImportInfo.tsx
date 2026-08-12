import { Check } from "lucide-react";

const IMPORT_ITEMS = [
  "Repositories & descriptions",
  "Pinned repositories",
  "Programming languages",
  "Primary tech stack",
  "Repository statistics",
  "Open source contributions",
];

const CONNECT_REASONS = [
  "No manual project entry",
  "Showcase your best work with GitHub links",
  "Automatically organize portfolio projects",
];

export default function GithubImportInfo() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-textMuted">
          What we&apos;ll import
        </p>
        <p className="mt-2 text-sm leading-6 text-textMuted">
          {IMPORT_ITEMS.join(" • ")}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-textMuted">
          Why connect?
        </p>
        <ul className="mt-2 space-y-1.5">
          {CONNECT_REASONS.map((reason) => (
            <li key={reason} className="flex items-start gap-2 text-sm text-text">
              <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
