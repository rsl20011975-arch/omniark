import type { NextConfig } from "next";

// Legacy English guide sections removed on 2026-10-10 (backup: .backups/legacy-english-articles-20261010).
// Already-indexed URLs are permanently redirected so crawlers and old links never hit a 404.
const legacySections = ["technology", "ai-digital-tools", "productivity", "web-internet"];

const nextConfig: NextConfig = {
  async redirects() {
    return legacySections.flatMap((section) => [
      { source: `/${section}`, destination: "/", permanent: true },
      { source: `/${section}/:path*`, destination: "/", permanent: true },
    ]);
  },
};

export default nextConfig;
