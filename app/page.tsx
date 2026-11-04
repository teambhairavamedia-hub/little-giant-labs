import type { Metadata } from "next";
import { HomeExperience } from "@/components/experience/HomeExperience";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { jsonLdScript, organizationJsonLd, socialMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary("en");
  return {
    title: {
      absolute: dict.seo.home.title,
    },
    description: dict.seo.home.description,
    ...socialMetadata(dict.seo.home.title, dict.seo.home.description, "/"),
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
