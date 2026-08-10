import { Link2 } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import {
  SiCodechef,
  SiCodeforces,
  SiHackerrank,
  SiLeetcode,
} from "react-icons/si";
import { Globe } from "lucide-react";

// Matches the normalized platform labels produced by the resume-parse
// pipeline (see server/src/ai/schemas/portfolio.schema.ts
// SOCIAL_PLATFORM_LABELS) plus manually-added links. Brand logos use
// react-icons per docs/ui-guidelines.md "Icons"; unrecognized platforms fall
// back to a generic Lucide link icon.
const PLATFORM_ICONS: Record<string, React.ElementType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaXTwitter,
  x: FaXTwitter,
  leetcode: SiLeetcode,
  hackerrank: SiHackerrank,
  codeforces: SiCodeforces,
  codechef: SiCodechef,
  portfolio: Globe,
  website: Globe,
};

export function getSocialPlatformIcon(platform: string): React.ElementType {
  return PLATFORM_ICONS[platform.trim().toLowerCase()] ?? Link2;
}
