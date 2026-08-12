const UNITS: Array<{ limit: number; divisor: number; label: string }> = [
  { limit: 60, divisor: 1, label: "s" },
  { limit: 3600, divisor: 60, label: "m" },
  { limit: 86400, divisor: 3600, label: "h" },
  { limit: 2592000, divisor: 86400, label: "d" },
  { limit: 31536000, divisor: 2592000, label: "mo" },
];

// "Updated 2d ago" style label for repository rows - short unit suffixes to
// match the reference design rather than a verbose Intl.RelativeTimeFormat
// string.
export function formatRelativeTime(isoDate: string | null): string {
  if (!isoDate) return "Unknown";

  const seconds = Math.max(0, (Date.now() - new Date(isoDate).getTime()) / 1000);

  if (seconds < UNITS[0].limit) return "Just now";

  for (const unit of UNITS) {
    if (seconds < unit.limit) {
      return `${Math.floor(seconds / unit.divisor)}${unit.label} ago`;
    }
  }

  return `${Math.floor(seconds / 31536000)}y ago`;
}
