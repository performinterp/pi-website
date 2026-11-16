import type { NextConfig } from "next";

// Inline scripts are unavoidable here: Easy-Read init runs before paint to
// prevent FOUC and ~25 JSON-LD <script type="application/ld+json"> blocks
// inject schema.org metadata. 'unsafe-inline' for script-src is the pragmatic
// baseline until we migrate every inline script to nonces.
//
// Pictures may come from any HTTPS host on every page. Events and venue pages
// show each event's official picture from the venue's own site. A per-route
// rule (strict everywhere but /events/, Jun 2026) broke this: Next.js keeps
// the first page's CSP on client-side navigation, so arriving at /events/
// from the home page blocked every venue picture, and the venue pages were
// always blocked (16 Nov 2026). Pictures can't run code, and with
// 'unsafe-inline' scripts a narrow img-src never closed the exfiltration path.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
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
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // BSL video feedback recorder needs camera + mic on this origin only;
    // the events "Near me" button needs location (it was blocked here).
    value: "camera=(self), microphone=(self), geolocation=(self), payment=(), usb=()",
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
    return [{ source: "/:path*", headers: securityHeaders }];
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
        // Business-card QR (Nov 2026). Temporary on purpose: the destination
        // can change later without reprinting, and browsers won't cache it.
        source: "/card",
        destination: "/organisers/",
        permanent: false,
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
