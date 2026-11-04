import type { Metadata } from "next";
import { AboutPageView } from "@/components/pages/AboutPageView";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { socialMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary("en");
  return {
    title: dict.seo.about.title,
    description: dict.seo.about.description,
    ...socialMetadata(`${dict.seo.about.title} | Little Giant Labs`, dict.seo.about.description, "/about"),
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
