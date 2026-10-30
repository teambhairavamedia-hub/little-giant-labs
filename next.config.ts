import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['10.162.61.106'],
  // Font files never change in place: a new version gets a new file name
  async headers() {
    return [
      {
        source: "/fonts/:file*.woff2",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
