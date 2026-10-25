import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ApplicationReceivedPageView } from "@/components/pages/ApplicationReceivedPageView";
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
    title: dict.seo.applicationReceived.title,
    description: dict.seo.applicationReceived.description,
    alternates: {
      canonical: locale === "en" ? "/application-received" : `/${locale}/application-received`,
      languages: {
        en: "/application-received",
        hi: "/hi/application-received",
        mr: "/mr/application-received",
        es: "/es/application-received",
        de: "/de/application-received",
        "x-default": "/application-received",
      },
    },
  };
}

export default async function LocalizedApplicationReceivedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  if (locale === "en") {
    redirect("/application-received");
  }

  return <ApplicationReceivedPageView />;
}
