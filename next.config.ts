import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['10.162.61.106'],
  // Next.js always bundles polyfills for Array.prototype.at/flat/flatMap, Object.fromEntries/hasOwn and
  // String.prototype.trimStart/trimEnd (next/dist/build/polyfills/polyfill-module.js, imported as
  // "../build/polyfills/polyfill-module"). Every browser Next.js 16 supports (Chrome/Edge/Firefox 111+, Safari 16.4+)
  // has these built in, so the module is replaced with an empty one; this clears PageSpeed's "Legacy JavaScript".
  // If a Next.js upgrade renames the import, the alias simply stops matching and the polyfills come back.
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": "./lib/polyfills/empty.js",
    },
  },
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
