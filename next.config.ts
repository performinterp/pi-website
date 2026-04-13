import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
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
    ];
  },
};

export default nextConfig;
