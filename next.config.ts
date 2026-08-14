import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack ignores stray lockfiles elsewhere on disk.
  turbopack: {
    root: __dirname,
  },
  // Allow Unsplash placeholder images through next/image optimization.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Next 16 restricts next/image quality to [75] by default. The site standard
    // is q=85 (see src/lib/images.ts), so allowlist the qualities we use.
    qualities: [75, 85, 90, 100],
  },
};

export default nextConfig;
