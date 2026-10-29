import type { ReactNode } from "react";

const accent = (text: string, key?: string) => (
  <span key={key} className="font-normal italic text-lgl-sage" style={{ fontFamily: "Georgia, serif" }}>
    {text}
  </span>
);

/* Headings end without a full stop (Latin "." or Devanagari "।"), including one just inside a closing *…* accent,
   and use a short spaced hyphen instead of an em dash ("different—and" → "different - and"). */
export function stripStop(title: string): string {
  return title.replace(/[.।](\*?)\s*$/, "$1").replace(/\s*—\s*/g, " - ");
}

/* Two-tone headings ("Driven by *conviction*"): the accent takes the sage serif-italic style.
   - Text wrapped in *…* is the accent ("From business challenge to *purposeful execution*").
   - Otherwise a two-sentence title accents its second sentence (split on the first "." or "।" + space).
   - Anything else renders unchanged. The trailing full stop is always dropped. */
export function accentTitle(rawTitle: string): ReactNode {
  const title = stripStop(rawTitle);
  const marked = /^([\s\S]*?)\*([\s\S]+?)\*([\s\S]*)$/.exec(title);
  if (marked) {
    return (
      <>
        {marked[1]}
        {accent(marked[2])}
        {marked[3]}
      </>
    );
  }
  const match = /[.।]\s/.exec(title);
  if (!match) return title;
  return (
    <>
      {title.slice(0, match.index + 1)} {accent(title.slice(match.index + 2))}
    </>
  );
}
