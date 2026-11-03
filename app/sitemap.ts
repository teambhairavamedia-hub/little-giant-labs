import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { servicePillars } from "@/lib/service-pillars";

/* The public English pages, including each service page. The translated pages are left out while the language selector is hidden. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    ...servicePillars.map(({ slug }) => ({ path: `/services/${slug}`, priority: 0.8 })),
    { path: "/about", priority: 0.8 },
    { path: "/contact", priority: 0.8 },
    { path: "/work", priority: 0.7 },
  ];
  return pages.map(({ path, priority }) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
