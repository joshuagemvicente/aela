import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Allow Server Actions to work with dev tunnels and proxies
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.devtunnels.ms",
      ],
    },
  },
};

export default nextConfig;
