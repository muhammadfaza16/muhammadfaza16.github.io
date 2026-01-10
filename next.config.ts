import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Only use static export for production builds
  // API routes work in development for the CMS
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
