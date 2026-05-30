import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1536, 1920, 2048, 2400],
    minimumCacheTTL: 31536000,
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
