import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { socialMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const description = "How Little Giant Labs collects, uses and protects personal information shared through this website.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  alternates: { canonical: "/privacy" },
  ...socialMetadata(`Privacy Policy | ${siteConfig.name}`, description, "/privacy"),
};

const LAST_UPDATED = "4 November 2026";

/* Describes what this website actually collects (enquiry form, lead source, analytics with consent) and the services
   it uses. English only. Keep it in step with the code when data collection changes. */
export default function PrivacyPage() {
  const email = siteConfig.email;
  return (
    <main className="min-h-screen bg-lgl-bg pb-16 pt-28 text-lgl-fg md:pb-24 md:pt-36">
      <Container>
        <article className="privacy-policy mx-auto max-w-3xl">
          <p className="home-eyebrow">Legal</p>
          <h1 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,2.75rem)] leading-[1.1] tracking-[-.04em]">Privacy Policy</h1>
          <p className="mt-3 text-sm text-lgl-soft">Last updated: {LAST_UPDATED}</p>

          <p className="mt-8">
            This policy explains how {siteConfig.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses and protects
            personal information when you visit {siteConfig.url.replace("https://", "")} or contact us through it.
          </p>

          <h2>1. Information you give us</h2>
          <p>When you send an enquiry through our contact form, we collect:</p>
          <ul>
            <li>your name, email address and company or brand name;</li>
            <li>the service you are interested in and the description of your challenge;</li>
            <li>optionally, your role and your approximate timeline.</li>
          </ul>
          <p>If you book a call or message us on WhatsApp or by email, we receive the details you share there.</p>

          <h2>2. Information collected automatically</h2>
          <ul>
            <li>
              <strong>How you found us.</strong> When you arrive, the website notes the campaign tags in the link you
              followed (for example <code>utm_source</code>), any ad click identifier, the website that referred you
              and the first page you visited. This is kept in your browser and sent with your enquiry, so we know which
              of our activities led to it.
            </li>
            <li>
              <strong>Analytics, only with your consent.</strong> If you accept analytics cookies, we use Google
              Analytics (and, if enabled, the Meta Pixel) to understand how visitors use the website and which
              campaigns bring enquiries. These tools are not loaded if you reject them.
            </li>
            <li>
              <strong>Preferences.</strong> Your browser remembers your light or dark theme and your cookie choice.
            </li>
          </ul>

          <h2>3. How we use your information</h2>
          <ul>
            <li>to reply to your enquiry and discuss how we can help;</li>
            <li>to understand which channels and campaigns bring enquiries, and to improve our website and marketing;</li>
            <li>to keep the website secure and prevent misuse, such as spam submissions.</li>
          </ul>
          <p>We do not sell your personal information.</p>

          <h2>4. Cookies and similar technologies</h2>
          <p>
            Analytics cookies are set only after you choose &ldquo;Accept&rdquo; in the cookie banner. You can change your
            choice at any time with &ldquo;Cookie settings&rdquo; at the bottom of every page. Your choice, your theme and
            how you found us are stored in your browser&rsquo;s local storage, not in cookies.
          </p>

          <h2>5. Services we use</h2>
          <p>We rely on trusted providers that process information on our behalf:</p>
          <ul>
            <li><strong>Vercel</strong>, which hosts the website;</li>
            <li><strong>Supabase</strong>, which stores enquiries in a secure database;</li>
            <li><strong>Resend</strong>, which sends us an email when an enquiry arrives;</li>
            <li><strong>Google Analytics</strong> and, if enabled, <strong>Meta</strong>, for analytics with your consent;</li>
            <li><strong>Calendly</strong>, if you book a call, and <strong>WhatsApp</strong>, if you message us.</li>
          </ul>
          <p>These providers may process information outside India under their own privacy and security terms.</p>

          <h2>6. How long we keep information</h2>
          <p>
            We keep enquiries for as long as needed to respond and to manage any resulting work, and delete them when
            they are no longer needed or when you ask us to, unless we must keep them by law.
          </p>

          <h2>7. Your choices and rights</h2>
          <p>
            You can ask us to access, correct or delete your personal information, or withdraw consent you have given,
            in line with applicable law, including India&rsquo;s Digital Personal Data Protection Act, 2023. To do so,
            email us at <a href={`mailto:${email}`}>{email}</a>.
          </p>

          <h2>8. Security</h2>
          <p>
            We use reasonable technical and organisational measures to protect your information, including encrypted
            connections and restricted access to stored enquiries. No method of transmission or storage is completely
            secure.
          </p>

          <h2>9. Contact us</h2>
          <p>
            {siteConfig.name}
            <br />
            {siteConfig.address.full}
            <br />
            <a href={`mailto:${email}`}>{email}</a>
          </p>

          <h2>10. Changes to this policy</h2>
          <p>We may update this policy from time to time. The date at the top shows when it last changed.</p>

          <p className="mt-10">
            <Link href="/contact" className="text-lgl-gold underline underline-offset-4">Back to Contact</Link>
          </p>
        </article>
      </Container>
    </main>
  );
}
