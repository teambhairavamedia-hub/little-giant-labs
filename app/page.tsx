import type { Metadata } from "next";
import { HomeExperience } from "@/components/experience/HomeExperience";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { jsonLdScript, organizationJsonLd, socialMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

// What a shared link to the homepage shows
const shareTitle = "Little Giant Labs — a strategic brand, creative, and digital growth studio";
const shareDescription =
  "Little Giant Labs is a strategic brand, creative, and digital growth studio that helps businesses bring clarity to what they offer, communicate why it matters, and connect meaningfully with the people who value it.";

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
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(structuredData) }} />
      <HomeExperience />
    </main>
  );
}
