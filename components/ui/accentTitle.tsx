import type { ReactNode } from "react";

const accent = (text: ReactNode, key?: string) => (
  <span key={key} className="block text-lgl-sage">
    {text}
  </span>
);

/* Headings end without a full stop (Latin "." or Devanagari "।"), including one just inside a closing *…* accent,
   and use a short spaced hyphen instead of an em dash ("different—and" → "different - and"). */
export function stripStop(title: string): string {
  return title.replace(/[.।](\*?)\s*$/, "$1").replace(/\s*—\s*/g, " - ");
}

/* Heading text never shows a full stop: one at the end is dropped, and one between two sentences becomes a normal
   space ("Build the brand. Tell the story." → "Build the brand Tell the story"). Trailing spaces are kept. */
export function headingText(text: string): string {
  const trailing = /\s$/.test(text) ? " " : "";
  return stripStop(text.trim()).split(/[.।]\s+/).join(" ") + trailing;
}

/* Two-tone headings ("Driven by *conviction*"): the accent is sage green, in the heading's own font, on its own line.
   - Text wrapped in *…* is the accent ("From business challenge to *purposeful execution*").
   - Otherwise a two-sentence title accents its second sentence (split on the first "." or "।" + space).
   - Anything else renders unchanged. Full stops are never shown (see headingText). */
export function accentTitle(rawTitle: string): ReactNode {
  const title = stripStop(rawTitle);
  const marked = /^([\s\S]*?)\*([\s\S]+?)\*([\s\S]*)$/.exec(title);
  if (marked) {
    return (
      <>
        {headingText(marked[1])}
        {accent(headingText(marked[2]))}
        {headingText(marked[3])}
      </>
    );
  }
  const match = /[.।]\s/.exec(title);
  if (!match) return headingText(title);
  return (
    <>
      {headingText(title.slice(0, match.index))} {accent(headingText(title.slice(match.index + 2)))}
    </>
  );
}
