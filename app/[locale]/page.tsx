import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { HomeExperience } from "@/components/experience/HomeExperience";
import { isValidLocale, locales, type Locale } from "@/lib/i18n/config";
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
    title: {
      absolute: dict.seo.home.title,
    },
    description: dict.seo.home.description,
    alternates: {
      canonical: locale === "en" ? "/" : `/${locale}`,
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

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  // Preserve canonical English URL at root
  if (locale === "en") {
    redirect("/");
  }

  return (
    <main>
      <HomeExperience />
    </main>
  );
}
