import type { Metadata } from "next";
import { ContactPageView } from "@/components/pages/ContactPageView";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { socialMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary("en");
  return {
    title: dict.seo.contact.title,
    description: dict.seo.contact.description,
    ...socialMetadata(`${dict.seo.contact.title} | Little Giant Labs`, dict.seo.contact.description, "/contact"),
    alternates: {
      canonical: "/contact",
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

export default function ContactPage() {
  return <ContactPageView />;
}
