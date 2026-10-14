type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  size?: "default" | "large";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  size = "default",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow ? (
        <p className="label-eyebrow mb-4 text-theme-subtle">{eyebrow}</p>
      ) : null}
      <h2
        className={
          size === "large"
            ? "text-[clamp(2.8rem,7vw,5.5rem)] font-bold tracking-[-0.04em] leading-[0.96] text-[var(--theme-fg)]"
            : "text-[clamp(2rem,4.5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[1.0] text-[var(--theme-fg)]"
        }
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-[0.9375rem] leading-[1.7] text-theme-muted font-normal">
          {description}
        </p>
      ) : null}
    </div>
  );
}
