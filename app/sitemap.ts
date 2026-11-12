import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { servicePillars } from "@/lib/service-pillars";
import { pageLastModified } from "@/lib/seo";

/* The public English pages, including each service page. The translated pages are left out while the language selector is hidden.
   Each page carries the date its content last changed (lib/seo.ts), so search engines know what to re-crawl. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; lastModified: string }[] = [
    { path: "/", priority: 1, lastModified: pageLastModified["/"] },
    { path: "/services", priority: 0.9, lastModified: pageLastModified["/services"] },
    ...servicePillars.map(({ slug }) => ({ path: `/services/${slug}`, priority: 0.8, lastModified: pageLastModified["/services/*"] })),
    { path: "/about", priority: 0.8, lastModified: pageLastModified["/about"] },
    { path: "/contact", priority: 0.8, lastModified: pageLastModified["/contact"] },
    { path: "/work", priority: 0.7, lastModified: pageLastModified["/work"] },
    { path: "/privacy", priority: 0.3, lastModified: pageLastModified["/privacy"] },
  ];
  return pages.map(({ path, priority, lastModified }) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
