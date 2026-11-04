import type { Metadata } from "next";
import { ServicesPageView } from "@/components/pages/ServicesPageView";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { socialMetadata } from "@/lib/seo";

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
  return <ServicesPageView />;
}
