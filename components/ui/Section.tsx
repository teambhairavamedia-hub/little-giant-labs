import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { sectionThemeClass, type SectionTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export type SectionProps = {
  theme: SectionTheme;
  children: ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ theme, children, className, id, style }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        data-section-theme={theme}
        className={cn(sectionThemeClass[theme], className)}
        style={style}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";
