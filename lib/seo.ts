import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

/* Open Graph and Twitter tags for one English page, so a shared link shows that page's own title and description.
   A page's openGraph replaces the layout's, so the shared fields are repeated here, including the image built by
   app/opengraph-image.tsx and app/twitter-image.tsx (Next.js adds those files automatically only on the home page). */
export function socialMetadata(title: string, description: string, path: string): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: "en_IN",
      type: "website",
      images: [{ url: `/opengraph-image?v=${SHARE_IMAGE_VERSION}`, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`/twitter-image?v=${SHARE_IMAGE_VERSION}`] },
  };
}

/* Change this whenever app/opengraph-image.tsx changes: chat apps cache preview images by address, so a new
   address makes them fetch the new image. */
const SHARE_IMAGE_VERSION = "2026-11-06";

/* Structured data describing the business, for Google's knowledge panel and local results. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    // Other ways people write the name, and a line that separates this studio from similarly named companies,
    // so search engines and AI assistants match "Little Giant Labs" searches to this business
    alternateName: ["LittleGiantLabs", "Little Giant Labs Pune", "LGL"],
    disambiguatingDescription: DISAMBIGUATION,
    url: siteConfig.url,
    logo: `${siteConfig.url}/lgl-mark-512.png`,
    image: `${siteConfig.url}/opengraph-image`,
    description: siteConfig.description,
    founder: siteConfig.founders.map((name) => ({ "@type": "Person", name })),
    knowsAbout: ["Brand strategy", "Brand positioning", "Creative content", "Digital marketing", "Employer branding", "Product marketing"],
    email: siteConfig.email,
    telephone: `+${siteConfig.whatsapp.number}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.address.lines[0]}, ${siteConfig.address.building}, Paud Road, Bhugaon`,
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      postalCode: "412115",
      addressCountry: "IN",
    },
    areaServed: "IN",
    // Official profiles: lets Google link them to this business (and show them for brand searches)
    sameAs: Object.values(siteConfig.social),
  };
}

/** One line telling search engines and AI assistants which "Little Giant Labs" this is */
export const DISAMBIGUATION =
  "Little Giant Labs is a brand strategy, creative and digital growth studio in Pune, India (littlegiantlabs.in). It is not Giant Labs, Inc. (the children's app developer) or Little Giant Ladder Systems.";

/** Serialises JSON-LD for a <script> tag, escaping "<" so the content can't close the tag early. */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
