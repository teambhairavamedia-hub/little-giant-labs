import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary("en");
  return {
    title: dict.seo.work.title,
    description: dict.seo.work.description,
    alternates: {
      canonical: "/work",
      languages: {
        en: "/work",
        hi: "/hi/work",
        mr: "/mr/work",
        es: "/es/work",
        de: "/de/work",
        "x-default": "/work",
      },
    },
  };
}

export default function WorkPage() {
  notFound();
}
