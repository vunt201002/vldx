/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,

  env: {
    DATA_MODE: process.env.DATA_MODE || 'api',
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    // Turbopack-specific config
    turbo: {
      rules: {
        // Handle SVG as React components
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
      resolveAlias: {
        // Mirror jsconfig.json path aliases
        '@/components': './components',
        '@/styles':     './styles',
        '@/lib':        './lib',
        '@/hooks':      './hooks',
        '@/utils':      './utils',
      },
      resolveExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css'],
    },

    // Tree-shake large packages automatically
    // Note: Do NOT include 'react' or 'react-dom' here — it breaks hooks during SSR
    optimizePackageImports: [],
  },

  // Proxy /api/* → Express backend (only in api mode)
  // In static mode, pages/api/[...path].js handles all /api/* requests
  // BACKEND_URL is set at build time for Docker, defaults to localhost for local dev
  async rewrites() {
    if (process.env.DATA_MODE === 'static') return [];
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:5000/api';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },

  // Faster image handling
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

module.exports = nextConfig;
