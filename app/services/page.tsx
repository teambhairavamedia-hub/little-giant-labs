import type { Metadata } from "next";
import { ServicesPageView } from "@/components/pages/ServicesPageView";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary("en");
  return {
    // Full SEO title, so the layout template must not append "| Little Giant Labs" again
    title: { absolute: dict.seo.services.title },
    description: dict.seo.services.description,
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
  return <ServicesPageView />;
}
