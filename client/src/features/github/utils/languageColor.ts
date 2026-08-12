// A trimmed version of GitHub's linguist language colors - just enough to
// give the repository picker's language dot recognizable colors for common
// stacks. Falls back to a neutral gray for anything not listed rather than
// pulling in the full linguist-colors dataset for one dot per row.
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
};

const FALLBACK_COLOR = "#94a3b8";

export function getLanguageColor(language: string | null): string {
  if (!language) return FALLBACK_COLOR;
  return LANGUAGE_COLORS[language] ?? FALLBACK_COLOR;
}
