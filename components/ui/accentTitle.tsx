import type { ReactNode } from "react";

const accent = (text: string, key?: string) => (
  <span key={key} className="font-normal italic text-lgl-sage" style={{ fontFamily: "Georgia, serif" }}>
    {text}
  </span>
);

/* Two-tone headings ("Driven by *conviction*"): the accent takes the sage serif-italic style.
   - Text wrapped in *…* is the accent ("From business challenge to *purposeful execution.*").
   - Otherwise a two-sentence title accents its second sentence (split on the first "." or "।" + space).
   - Anything else renders unchanged. */
export function accentTitle(title: string): ReactNode {
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
