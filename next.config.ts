import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['10.162.61.106'],
  // Project covers are stored in Vercel Blob; next/image resizes them and serves WebP/AVIF
  images: {
    formats: ["image/avif", "image/webp"],
    // In `next dev` images are served as-is: on some networks the DNS answers Blob with a NAT64 (64:ff9b::) address,
    // which the local optimizer rejects as a private IP, so covers would not show. Production builds still optimize.
    unoptimized: process.env.NODE_ENV === "development",    remotePatterns: [{ protocol: "https", hostname: "6xft9z0vzph7qrfh.public.blob.vercel-storage.com", pathname: "/media/**" }],
  },
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
