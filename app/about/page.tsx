import type { Metadata } from "next";
import { AboutPageView } from "@/components/pages/AboutPageView";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary("en");
  return {
    title: dict.seo.about.title,
    description: dict.seo.about.description,
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
