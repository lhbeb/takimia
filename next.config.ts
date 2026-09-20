import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://chatapppay-rust.vercel.app https://connect.facebook.net https://js.stripe.com https://va.vercel-scripts.com https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://t.contentsquare.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https: http:",
  "media-src 'self' data: blob: https:",
  "frame-src 'self' https://chatapppay-rust.vercel.app https://js.stripe.com https://hooks.stripe.com https://*.stripe.com https://www.googletagmanager.com https://googleads.g.doubleclick.net",
  "connect-src 'self' https://chatapppay-rust.vercel.app https://*.supabase.co https://api.stripe.com https://*.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://connect.facebook.net https://www.facebook.com https://graph.facebook.com https://t.contentsquare.net https://c.contentsquare.net https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
].join('; ');

const nextConfig: NextConfig = {
  // Keep development and production artifacts separate so `next build` cannot
  // corrupt a running dev server's manifests.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  images: {
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'xavlyin.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
};

export default nextConfig;
