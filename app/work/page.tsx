import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { WorkPageView } from "@/components/pages/WorkPageView";

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
  return <WorkPageView dict={getDictionary("en")} />;
}
