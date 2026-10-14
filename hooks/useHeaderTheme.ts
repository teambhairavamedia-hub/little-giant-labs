"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { SectionTheme } from "@/lib/theme";

export function useHeaderTheme() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<SectionTheme>("dark");

  useEffect(() => {
    const syncTheme = () => {
      const sections = document.querySelectorAll<HTMLElement>("[data-section-theme]");
      if (!sections.length) {
        setTheme("light");
        return;
      }

      const headerOffset = 96;
      let active: SectionTheme = "dark";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= headerOffset && rect.bottom > headerOffset) {
          const value = section.dataset.sectionTheme;
          if (value === "dark" || value === "light") {
            active = value;
          }
        }
      });

      setTheme(active);
    };

    syncTheme();
    window.addEventListener("scroll", syncTheme, { passive: true });
    window.addEventListener("resize", syncTheme);

    return () => {
      window.removeEventListener("scroll", syncTheme);
      window.removeEventListener("resize", syncTheme);
    };
  }, [pathname]);

  return theme;
}
