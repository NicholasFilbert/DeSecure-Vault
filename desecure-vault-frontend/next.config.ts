import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ['http://admin.localhost:3000'], // ✅ plain string, no slash at the end
  },
};

export default nextConfig;
