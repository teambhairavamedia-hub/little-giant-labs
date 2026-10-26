import { CaseStudyGrid } from "@/components/work/CaseStudyGrid";
import type { TranslationDictionary } from "@/lib/i18n/types";

export function WorkPageView({ dict }: { dict: TranslationDictionary }) {
  const copy = dict.workPage;
  return (
    <main className="section-light min-h-screen px-5 pb-20 pt-32 sm:px-8 md:pb-28 md:pt-40">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 max-w-3xl md:mb-14">
          <p className="label-eyebrow mb-5 text-[var(--lgl-gold)]">{copy.eyebrow}</p>
          <h1 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--lgl-muted)] md:text-base">
            {copy.attribution}
          </p>
          <a
            href="https://www.bhairavamedia.in/work"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex text-xs font-semibold uppercase tracking-widest text-[var(--lgl-gold)] hover:underline"
          >
            {copy.sourceLink} ↗
          </a>
        </header>
        <CaseStudyGrid />
      </div>
    </main>
  );
}
