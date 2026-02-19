import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https?.+\.(mp3|aac|m4a|wav|webm)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "audio-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  /* config options here */
  // Vercel deployment: Use default output (Node.js server) instead of 'export'
  // output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    // Enable image optimization on Vercel
    // unoptimized: true, 
    qualities: [75, 90],
  },
  reactCompiler: true,
  // Acknowledge Next.js 16 Turbopack default
  turbopack: {},
};

export default withPWA(nextConfig);
