// Backend URL fields accept bare hostnames (require_protocol: false, see
// server/src/portfolio/dto/*.dto.ts), so an href built directly from stored
// data can be protocol-relative garbage like "github.com/x" - prepend
// https:// only when no scheme is already present.
export function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}
