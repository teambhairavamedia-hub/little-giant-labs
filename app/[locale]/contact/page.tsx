import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ContactPageView } from "@/components/pages/ContactPageView";
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
    title: dict.seo.contact.title,
    description: dict.seo.contact.description,
    alternates: {
      canonical: locale === "en" ? "/contact" : `/${locale}/contact`,
      languages: {
        en: "/contact",
        hi: "/hi/contact",
        mr: "/mr/contact",
        es: "/es/contact",
        de: "/de/contact",
        "x-default": "/contact",
      },
    },
  };
}

export default async function LocalizedContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  if (locale === "en") {
    redirect("/contact");
  }

  return <ContactPageView />;
}
