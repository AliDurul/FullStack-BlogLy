import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    domains: [ 'lh3.googleusercontent.com', 'api.dicebear.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: ''
      }
    ],
    dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  }
};

export default nextConfig;
