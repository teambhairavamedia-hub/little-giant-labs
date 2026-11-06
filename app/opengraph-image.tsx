import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

/* The preview image for shared links (WhatsApp, LinkedIn, X, Slack…) on every page. Built once at build time.
   Everything sits in the centre 630×630 square: WhatsApp's compact preview crops the image to that square, while
   the large preview and other apps show the whole 1200×630 image. */
export const alt = `${siteConfig.name}: a strategic brand, creative, and digital growth studio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/lgl-logo-horizontal-dark.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1B2B",
          color: "#F8F6F0",
        }}
      >
        {/* The logo file is 1200×766 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={500} height={319} alt="" />
        <div style={{ width: 64, height: 4, marginTop: 34, background: "#C5A059" }} />
        <div
          style={{
            marginTop: 22,
            maxWidth: 500,
            fontSize: 28,
            lineHeight: 1.35,
            textAlign: "center",
            color: "rgba(248,246,240,.92)",
          }}
        >
          A strategic brand, creative, and digital growth studio
        </div>
      </div>
    ),
    size,
  );
}
