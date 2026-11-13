import type { Metadata } from "next";
import { preload } from "react-dom";
import { PublicChrome } from "@/components/layout/PublicChrome";
import { siteConfig } from "@/lib/site";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { themeInitScript } from "@/lib/theme";
import { consentInitScript } from "@/lib/consent";
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
  // "HTML tag" site verification for Google Search Console and Bing Webmaster Tools; each token comes from that
  // tool via an env var, and the tag is left out while the variable is unset
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    // Bing's code is public (it is in the page source); BING_SITE_VERIFICATION can override it
    other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION || "45BD22A54F335C8B1B6E8108E4781C7F" },
  },
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "en_IN",
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
        <script dangerouslySetInnerHTML={{ __html: consentInitScript }} />
      </head>
      <body className="antialiased">
        <SmoothScroll>
          <PublicChrome>{children}</PublicChrome>
        </SmoothScroll>
      </body>
    </html>
  );
}
