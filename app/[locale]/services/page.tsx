import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ServicesPageView } from "@/components/pages/ServicesPageView";
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
    title: dict.seo.services.title,
    description: dict.seo.services.description,
    alternates: {
      canonical: locale === "en" ? "/services" : `/${locale}/services`,
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

export default async function LocalizedServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  if (locale === "en") {
    redirect("/services");
  }

  return <ServicesPageView />;
}
