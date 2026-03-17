/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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

  // Proxy /api/* → Express backend (kept from before)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/:path*`,
      },
    ];
  },

  // Faster image handling
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
