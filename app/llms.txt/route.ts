import { getDictionary } from "@/lib/i18n/dictionaries";
import { servicePillars } from "@/lib/service-pillars";
import { siteConfig } from "@/lib/site";

/* /llms.txt: a plain summary of the site for AI assistants (the llmstxt.org format), built from the same English text
   as the pages so it stays current. Rebuilt with each deployment. */
export const dynamic = "force-static";

const clean = (text: string) => text.replace(/\*/g, "").replace(/\s+/g, " ").trim();

export function GET() {
  const dict = getDictionary("en");
  const url = (path: string) => `${siteConfig.url}${path}`;
  const services = dict.servicesPage.items.map((item, index) => {
    const firstSentence = clean(item.intro.split("\n\n")[0]).replace(/(?<=\.)\s.*$/, "");
    return `- [${item.label}](${url(`/services/${servicePillars[index].slug}`)}): ${firstSentence}`;
  });

  const body = `# ${siteConfig.name}

> ${clean(dict.seo.home.description)}

${siteConfig.name} is a strategic brand, creative, and digital growth studio based in Pune, India. It works with businesses on brand strategy, creative and content, digital growth, employer branding, and technology and product marketing.

## Services

${services.join("\n")}

## Company

- [About](${url("/about")}): ${clean(dict.seo.about.description)}
- [Our work](${url("/work")}): ${clean(dict.seo.work.description)}
- [Contact](${url("/contact")}): ${clean(dict.seo.contact.description)}

## Contact details

- Email: ${siteConfig.email}
- WhatsApp: ${siteConfig.whatsapp.display}
- Address: ${siteConfig.address.full}
- LinkedIn: ${siteConfig.social.linkedin}
- X: ${siteConfig.social.twitter}
- Instagram: ${siteConfig.social.instagram}

## Optional

- [Privacy Policy](${url("/privacy")})
- [Sitemap](${url("/sitemap.xml")})
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
