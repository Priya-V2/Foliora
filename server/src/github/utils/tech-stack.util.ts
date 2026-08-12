// A repository's tech stack is more than its single "primary language" -
// GitHub's /languages endpoint reports a byte-size breakdown of every
// language present. We rank by that breakdown (most bytes first), put the
// primary language first since it's the most meaningful signal, dedupe, and
// cap the list so a repo with dozens of vendored languages doesn't produce
// an unusable Project.techStack.
const MAX_TECH_STACK_SIZE = 6;

export function deriveTechStack(
  primaryLanguage: string | null,
  languages: Record<string, number>,
): string[] {
  const byUsageDesc = Object.entries(languages)
    .sort(([, bytesA], [, bytesB]) => bytesB - bytesA)
    .map(([name]) => name);

  const ordered = primaryLanguage
    ? [
        primaryLanguage,
        ...byUsageDesc.filter((name) => name !== primaryLanguage),
      ]
    : byUsageDesc;

  return Array.from(new Set(ordered)).slice(0, MAX_TECH_STACK_SIZE);
}
