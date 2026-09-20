import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep development and production artifacts separate so `next build` cannot
  // corrupt a running dev server's manifests.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  images: {
    // Product images are already public CDN assets. Avoid Vercel's optimizer
    // rejecting remote Supabase URLs in deployments with stale image manifests.
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
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
        hostname: 'vfuedgrheyncotoxseos.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sappffmylpsmbidysyqh.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uozcmaheslvjrwfxfzip.supabase.co',
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
  // Keep the policy explicit while allowing the services used by the storefront.
  // Next.js currently requires unsafe-inline for its inline RSC/bootstrap payloads;
  // unsafe-eval is intentionally not allowed in production.
  async headers() {
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self' https://checkout.stripe.com",
      "script-src 'self' 'unsafe-inline' https://connect.facebook.net https://js.stripe.com https://va.vercel-scripts.com https://www.googletagmanager.com https://t.contentsquare.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co https://api.stripe.com https://r.stripe.com https://checkout.stripe.com https://connect.facebook.net https://www.facebook.com https://*.vercel-insights.com https://vitals.vercel-insights.com https://www.google.com https://www.googleadservices.com https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://t.contentsquare.net",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
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
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },
  // Vercel optimizations
  compress: true,
  poweredByHeader: false,
  // Ensure proper serverless function timeouts
  experimental: {
    // Optimize serverless functions for Vercel
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
};

export default nextConfig;
