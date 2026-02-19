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
  images: {
    unoptimized: true,
    qualities: [75, 90],
  },
  reactCompiler: true,
  // Acknowledge Next.js 16 Turbopack default
  turbopack: {},
};

export default withPWA(nextConfig);
