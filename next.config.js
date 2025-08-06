/** @type {import('next').NextConfig} */

// Standalone output for deployment
module.exports = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: [
      'raw.githubusercontent.com',
      'assets.pokemon.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/PokeAPI/sprites/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['axios']
  },
  // Enable static exports for deployment
  output: 'standalone',
}
