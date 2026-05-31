import type { NextConfig } from "next";

// Inline scripts are unavoidable here: Easy-Read init runs before paint to
// prevent FOUC and ~25 JSON-LD <script type="application/ld+json"> blocks
// inject schema.org metadata. 'unsafe-inline' for script-src is the pragmatic
// baseline until we migrate every inline script to nonces.
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://media.performanceinterpreting.co.uk",
  "media-src 'self' blob: https://media.performanceinterpreting.co.uk",
  "font-src 'self' data:",
  "connect-src 'self' https://pi-feedback-uploads.vercel.app https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-src https://tally.so",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // BSL video feedback recorder needs camera + mic on this origin only.
    value: "camera=(self), microphone=(self), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1536, 1920, 2048, 2400],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/deaf-community/app-guide",
        destination: "/app-guide",
        permanent: true,
      },
      {
        source: "/organisers/app-guide",
        destination: "/app-guide",
        permanent: true,
      },
      {
        source: "/photo-consent",
        destination:
          "https://docs.google.com/forms/d/e/1FAIpQLSeUKd3cA2qrMl3mbri1ASi0l4CAKci7THRdG6lVxdGShoGC7g/viewform",
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
