import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // This prevents type errors from failing your Vercel builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
