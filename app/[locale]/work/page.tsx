import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
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
    title: dict.seo.work.title,
    description: dict.seo.work.description,
    alternates: {
      canonical: locale === "en" ? "/work" : `/${locale}/work`,
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

export default async function LocalizedWorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  if (locale === "en") {
    redirect("/work");
  }

  notFound();
}
