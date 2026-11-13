import type { Metadata } from "next";
import { preconnect } from "react-dom";
import { HomeExperience } from "@/components/experience/HomeExperience";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { jsonLdScript, organizationJsonLd, socialMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

// What a shared link to the homepage shows
const shareTitle = "Little Giant Labs — a strategic brand, creative, and digital growth studio";
const shareDescription =
  // Kept near 150 characters so link previews and search engines show it in full
  "Little Giant Labs is a strategic brand, creative and digital growth studio in Pune, helping businesses show what they offer and why it matters.";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary("en");
  return {
    title: {
      absolute: dict.seo.home.title,
    },
    description: dict.seo.home.description,
    // Link previews (WhatsApp, LinkedIn, X) show the title in bold above the description. Google results keep the
    // keyword title and description above.
    ...socialMetadata(shareTitle, shareDescription, "/"),
    alternates: {
      canonical: "/",
      languages: {
        en: "/",
        hi: "/hi",
        mr: "/mr",
        es: "/es",
        de: "/de",
        "x-default": "/",
      },
    },
  };
}

// The business and the website, as structured data for search engines
const structuredData = [
  organizationJsonLd(),
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  },
];

export default function Home() {
  // The first-visit intro (LandingCascade) shows Unsplash photos; connecting from the server HTML lets the browser set
  // up the connection while scripts load, instead of only once the intro starts
  preconnect("https://images.unsplash.com");
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(structuredData) }} />
      <HomeExperience />
    </main>
  );
}
