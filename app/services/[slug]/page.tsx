import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailView } from "@/components/pages/ServiceDetailView";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { servicePillars } from "@/lib/service-pillars";

// One English page per service; other slugs are 404s
export const dynamicParams = false;

export function generateStaticParams() {
  return servicePillars.map(({ slug }) => ({ slug }));
}

function findService(slug: string) {
  const index = servicePillars.findIndex((pillar) => pillar.slug === slug);
  return index < 0 ? null : { index, item: getDictionary("en").servicesPage.items[index] };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return {};
  // First paragraph of the service description, cut at a word near 155 characters for search results
  const first = service.item.intro.split("\n\n")[0];
  const description = first.length > 158 ? `${first.slice(0, 155).replace(/\s+\S*$/, "")}…` : first;
  return {
    title: service.item.label,
    description,
    alternates: { canonical: `/services/${slug}` },
    openGraph: { title: `${service.item.label} | Little Giant Labs`, description, type: "website" },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();
  return <ServiceDetailView index={service.index} />;
}
