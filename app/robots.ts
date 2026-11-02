import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/* Lets search engines crawl the public site, keeps the admin area and APIs out, and points to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
