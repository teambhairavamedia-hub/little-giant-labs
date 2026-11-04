import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

/* The preview image for shared links (WhatsApp, LinkedIn, X, Slack…) on every page. Built once at build time. */
export const alt = `${siteConfig.name}: brand strategy, creative and digital marketing`;
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
          gap: 64,
          padding: "0 80px",
          background: "#0B1B2B",
          color: "#F8F6F0",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={470} height={300} alt="" />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ width: 64, height: 4, background: "#C5A059", marginBottom: 28 }} />
          <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.1 }}>{siteConfig.tagline}</div>
          <div style={{ marginTop: 24, fontSize: 28, lineHeight: 1.4, color: "rgba(248,246,240,.75)" }}>
            Brand strategy, creative and digital marketing. Pune, India.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
