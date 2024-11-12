// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true, // Ignore les erreurs ESLint lors du build
  },

  typescript: {
    ignoreBuildErrors: true, // Ignore les erreurs TypeScript lors du build
  },
};

export default nextConfig;
