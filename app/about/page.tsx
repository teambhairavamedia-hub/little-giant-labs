import type { Metadata } from "next";
import { AboutPageView } from "@/components/pages/AboutPageView";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { socialMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary("en");
  return {
    // "About Little Giant Labs" already names the brand, so the layout must not append "| Little Giant Labs"
    title: { absolute: dict.seo.about.title },
    description: dict.seo.about.description,
    ...socialMetadata(dict.seo.about.title, dict.seo.about.description, "/about"),
    alternates: {
      canonical: "/about",
      languages: {
        en: "/about",
        hi: "/hi/about",
        mr: "/mr/about",
        es: "/es/about",
        de: "/de/about",
        "x-default": "/about",
      },
    },
  };
}

export default function AboutPage() {
  return <AboutPageView />;
}
