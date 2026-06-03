import type { NextConfig } from "next";

// Inline scripts are unavoidable here: Easy-Read init runs before paint to
// prevent FOUC and ~25 JSON-LD <script type="application/ld+json"> blocks
// inject schema.org metadata. 'unsafe-inline' for script-src is the pragmatic
// baseline until we migrate every inline script to nonces.
const STRICT_IMG_SRC =
  "img-src 'self' data: blob: https://media.performanceinterpreting.co.uk";
// /events/ renders venue-scraped images from arbitrary HTTPS hosts (the page
// has no user input — it's curated from the PI Workflow sheet — so loosening
// here doesn't open an exfiltration path that strict 'self' was guarding).
const EVENTS_IMG_SRC = "img-src 'self' data: blob: https:";

const buildCSP = (imgSrc: string) =>
  [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    imgSrc,
    "media-src 'self' blob: https://media.performanceinterpreting.co.uk",
    "font-src 'self' data:",
    "connect-src 'self' https://pi-feedback-uploads.vercel.app https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    "frame-src https://tally.so",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

const sharedSecurityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // BSL video feedback recorder needs camera + mic on this origin only.
    value: "camera=(self), microphone=(self), geolocation=(), payment=(), usb=()",
  },
];

const strictHeaders = [
  { key: "Content-Security-Policy", value: buildCSP(STRICT_IMG_SRC) },
  ...sharedSecurityHeaders,
];

const eventsHeaders = [
  { key: "Content-Security-Policy", value: buildCSP(EVENTS_IMG_SRC) },
  ...sharedSecurityHeaders,
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1536, 1920, 2048, 2400],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      { source: "/events/:path*", headers: eventsHeaders },
      { source: "/:path((?!events(?:/|$)).*)", headers: strictHeaders },
    ];
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
