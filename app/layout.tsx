import type { Metadata } from "next";
import { preload } from "react-dom";
import { PublicChrome } from "@/components/layout/PublicChrome";
import { siteConfig } from "@/lib/site";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { themeInitScript } from "@/lib/theme";
import "./fonts.css";
import "./globals.css";

// Fonts are self-hosted (app/fonts.css). These are the faces every page needs straight away.
const preloadedFonts = [
  "/fonts/dm-sans-latin.woff2",
  "/fonts/manrope-latin.woff2",
  "/fonts/noto-sans-devanagari-devanagari.woff2",
  "/fonts/noto-sans-devanagari-latin.woff2",
];

export const metadata: Metadata = {
  // Makes canonical and alternate links absolute (https://www.littlegiantlabs.in/…)
  metadataBase: new URL(siteConfig.url),
  // Google Search Console "HTML tag" verification; the token comes from Search Console via an env var
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      // Google prefers square icons in multiples of 48px
      { url: "/lgl-mark-48.png", sizes: "48x48", type: "image/png" },
      { url: "/lgl-mark-96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/lgl-mark-apple.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preloadedFonts.forEach((href) => preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" }));

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">
        <SmoothScroll>
          <PublicChrome>{children}</PublicChrome>
        </SmoothScroll>
      </body>
    </html>
  );
}
