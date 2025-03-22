import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fullstack-blogly.s3.eu-north-1.amazonaws.com',
        port: ''
      },
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
    dangerouslyAllowSVG: true, // Allows SVG images
  }
};

export default nextConfig;