/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed `output: 'export'` so the app can use dynamic server/API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
