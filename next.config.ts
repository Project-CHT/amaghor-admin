import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This prevents ESLint from failing your Vercel builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This prevents type errors from failing your Vercel builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
