import type { Metadata } from "next";
import { HomeExperience } from "@/components/experience/HomeExperience";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary("en");
  return {
    title: dict.seo.home.title,
    description: dict.seo.home.description,
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

export default function Home() {
  return (
    <main>
      <HomeExperience />
    </main>
  );
}
