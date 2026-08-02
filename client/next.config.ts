import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // The backend emails verification links pointing at "/verify-email"
  // (server/src/auth/services/email.service.ts). The page itself lives at
  // "/auth/verify-email" to match the other auth routes, so requests to the
  // legacy emailed path are transparently served from there.
  async rewrites() {
    return [{ source: "/verify-email", destination: "/auth/verify-email" }];
  },
};

export default nextConfig;
