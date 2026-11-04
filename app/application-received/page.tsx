import type { Metadata } from "next";
import { ApplicationReceivedPageView } from "@/components/pages/ApplicationReceivedPageView";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary("en");
  return {
    title: dict.seo.applicationReceived.title,
    description: dict.seo.applicationReceived.description,
    // Thank-you page after an enquiry: not useful in search results
    robots: { index: false, follow: true },
    alternates: {
      canonical: "/application-received",
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

export default function ApplicationReceivedPage() {
  return <ApplicationReceivedPageView />;
}
