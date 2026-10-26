import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AboutPageView } from "@/components/pages/AboutPageView";
import { isValidLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function generateStaticParams() {
  return locales.filter((loc) => loc !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    title: dict.seo.about.title,
    description: dict.seo.about.description,
    alternates: {
      canonical: locale === "en" ? "/about" : `/${locale}/about`,
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

export default async function LocalizedAboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  if (locale === "en") {
    redirect("/about");
  }

  return <AboutPageView />;
}
