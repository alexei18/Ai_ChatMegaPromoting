/** @type {import('next').NextConfig} */

const nextConfig = {
  // nimic special aici; App Router e implicit în Next 13+
  images: {
    domains: ['images.pexels.com'],
    unoptimized: false,
  },
  eslint: {
    // Permite build-ul pe Vercel chiar daca exista erori ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Permite build-ul pe Vercel chiar daca exista erori TypeScript
    ignoreBuildErrors: false,
  },
  experimental: {
    // Optimizari pentru Vercel
    optimizePackageImports: ['framer-motion', 'gsap', 'lucide-react'],
  },
};
module.exports = nextConfig;
