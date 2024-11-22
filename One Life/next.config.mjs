/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
