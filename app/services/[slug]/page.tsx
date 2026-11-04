import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailView } from "@/components/pages/ServiceDetailView";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { servicePillars } from "@/lib/service-pillars";
import { jsonLdScript, socialMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

// One English page per service; other slugs are 404s
export const dynamicParams = false;

export function generateStaticParams() {
  return servicePillars.map(({ slug }) => ({ slug }));
}

function findService(slug: string) {
  const index = servicePillars.findIndex((pillar) => pillar.slug === slug);
  if (index < 0) return null;
  const item = getDictionary("en").servicesPage.items[index];
  // First paragraph of the service description, cut at a word near 155 characters for search results
  const first = item.intro.split("\n\n")[0];
  const description = first.length > 158 ? `${first.slice(0, 155).replace(/\s+\S*$/, "")}…` : first;
  return { index, item, description };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return {};
  // "Services in Pune" adds the words people search for; the layout template appends "| Little Giant Labs"
  const title = `${service.item.label} Services in Pune`;
  return {
    title,
    description: service.description,
    alternates: { canonical: `/services/${slug}` },
    ...socialMetadata(`${title} | ${siteConfig.name}`, service.description, `/services/${slug}`),
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();
  // The service and where it sits on the site, as structured data for search engines
  const url = `${siteConfig.url}/services/${slug}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.item.label,
      serviceType: service.item.label,
      description: service.description,
      url,
      areaServed: "IN",
      provider: { "@type": "ProfessionalService", "@id": `${siteConfig.url}/#organization`, name: siteConfig.name, url: siteConfig.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Services", item: `${siteConfig.url}/services` },
        { "@type": "ListItem", position: 3, name: service.item.label, item: url },
      ],
    },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(structuredData) }} />
      <ServiceDetailView index={service.index} />
    </>
  );
}
