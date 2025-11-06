/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimalisaties
  reactStrictMode: true,

  // Bundle optimalisaties - optimaliseer imports van UI componenten
  experimental: {
    optimizePackageImports: ['@/components/ui', 'lucide-react'],
  },

  // Performance monitoring
  poweredByHeader: false,

  // Compressie voor productie (standaard aan in Next.js 15)
  compress: true,
};

module.exports = nextConfig;
