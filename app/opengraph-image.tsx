import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

/* The preview image for shared links (WhatsApp, LinkedIn, X, Slack…) on every page. Built once at build time. */
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
          alignItems: "center",
          gap: 44,
          padding: "0 56px",
          background: "#0B1B2B",
          color: "#F8F6F0",
        }}
      >
        {/* Large, so the logo stays clear in the small previews chat apps show (the file is 1200×766) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={620} height={396} alt="" />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ width: 56, height: 4, background: "#C5A059", marginBottom: 24 }} />
          <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.12 }}>{siteConfig.tagline}</div>
          <div style={{ marginTop: 20, fontSize: 25, fontWeight: 700, lineHeight: 1.4, color: "rgba(248,246,240,.9)" }}>
            A strategic brand, creative, and digital growth studio.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
