import type { Metadata } from "next";
import { ServicesPageView } from "@/components/pages/ServicesPageView";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { jsonLdScript, socialMetadata, webPageJsonLd } from "@/lib/seo";
import { servicePillars } from "@/lib/service-pillars";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary("en");
  return {
    // Full SEO title, so the layout template must not append "| Little Giant Labs" again
    title: { absolute: dict.seo.services.title },
    description: dict.seo.services.description,
    ...socialMetadata(dict.seo.services.title, dict.seo.services.description, "/services"),
    alternates: {
      canonical: "/services",
      languages: {
        en: "/services",
        hi: "/hi/services",
        mr: "/mr/services",
        es: "/es/services",
        de: "/de/services",
        "x-default": "/services",
      },
    },
  };
}

export default function ServicesPage() {
  const dict = getDictionary("en");
  // The page and the five services it lists (each linking to its own page), as structured data for search engines
  const structuredData = webPageJsonLd("CollectionPage", "/services", dict.seo.services.title, dict.seo.services.description, {
    mainEntity: {
      "@type": "ItemList",
      itemListElement: servicePillars.map(({ slug }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: dict.servicesPage.items[index].label,
        url: `${siteConfig.url}/services/${slug}`,
      })),
    },
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(structuredData) }} />
      <ServicesPageView />
    </>
  );
}
