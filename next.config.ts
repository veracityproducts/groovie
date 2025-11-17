import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable Cache Components (Next.js 16 feature)
  cacheComponents: true,

  experimental: {
    // Enable filesystem caching for faster dev restarts
    turbopackFileSystemCacheForDev: true,
  },

  // Turbopack is now default (no configuration needed)
  // Use --webpack flag to opt out if needed
};

export default nextConfig;
