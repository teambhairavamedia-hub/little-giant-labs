"use client";

import { motion, type Transition } from "framer-motion";
import { useEffect, useRef, useState, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

export type NavItem = {
  label: string;
  href: string;
  target?: "_self" | "_blank";
};

type FloatingPillNavigationProps = {
  items: NavItem[];
  backgroundColor?: string;
  textColor?: string;
  activeBackgroundColor?: string;
  activeTextColor?: string;
  padding?: number;
  gap?: number;
  linkPadding?: string;
  transition?: Transition;
  className?: string;
};

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 38,
  mass: 0.6,
};

function getActiveLabel(items: NavItem[], pathname: string) {
  const match = items.find((item) => item.href === pathname);
  if (match) return match.label;
  if (pathname === "/") return items[0]?.label ?? "";
  return items[0]?.label ?? "";
}

export function FloatingPillNavigation({
  items,
  backgroundColor = "transparent",
  textColor = "#525252",
  activeBackgroundColor = "rgba(10, 10, 10, 0.88)",
  activeTextColor = "#ffffff",
  padding = 4,
  gap = 0,
  linkPadding = "10px 20px",
  transition = defaultTransition,
  className = "",
}: FloatingPillNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(() =>
    getActiveLabel(items, pathname),
  );

  const navRef = useRef<HTMLElement>(null);
  const linkRef = useRef<HTMLDivElement>(null);
  const [navBorderRadius, setNavBorderRadius] = useState(50);
  const [linkBorderRadius, setLinkBorderRadius] = useState(25);

  useEffect(() => {
    startTransition(() => {
      setActiveLink(getActiveLabel(items, pathname));
    });
  }, [items, pathname]);

  useEffect(() => {
    const updateBorderRadii = () => {
      if (navRef.current) {
        setNavBorderRadius(navRef.current.offsetHeight / 2);
      }
      if (linkRef.current) {
        setLinkBorderRadius(linkRef.current.offsetHeight / 2);
      }
    };

    updateBorderRadii();

    const resizeObserver = new ResizeObserver(updateBorderRadii);
    if (navRef.current) resizeObserver.observe(navRef.current);
    if (linkRef.current) resizeObserver.observe(linkRef.current);

    return () => resizeObserver.disconnect();
  }, [linkPadding, items]);

  const handleClick = (label: string, href: string, target?: "_self" | "_blank") => {
    startTransition(() => {
      setActiveLink(label);
    });

    if (!href) return;

    const isExternal =
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    if (isExternal) {
      if (target === "_blank") {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        window.location.assign(href);
      }
      return;
    }

    router.push(href);
  };

  return (
    <nav
      ref={navRef}
      className={className}
      style={{
        display: "inline-flex",
        backgroundColor,
        borderRadius: navBorderRadius,
        padding,
        gap,
        position: "relative",
        width: "max-content",
        userSelect: "none",
      }}
    >
      {items.map((item, index) => {
        const isActive = item.label === activeLink;

        return (
          <div
            key={item.label}
            ref={index === 0 ? linkRef : null}
            onClick={() => handleClick(item.label, item.href, item.target)}
            style={{
              position: "relative",
              padding: linkPadding,
              color: isActive ? activeTextColor : textColor,
              cursor: "pointer",
              zIndex: 1,
              transition: "color 0.3s ease",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: "20px",
            }}
          >
            {isActive ? (
              <motion.div
                layoutId="activeBackground"
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: activeBackgroundColor,
                  borderRadius: linkBorderRadius,
                  zIndex: -1,
                  boxShadow:
                    "0 4px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                }}
                transition={transition}
              />
            ) : null}
            {item.label}
          </div>
        );
      })}
    </nav>
  );
}
