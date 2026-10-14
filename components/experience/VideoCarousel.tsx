"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
  type CSSProperties,
} from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Transition,
} from "framer-motion";

export type VideoCarouselItem = {
  sourceType?: "url" | "upload";
  url?: string;
  upload?: string;
  poster?: {
    src?: string;
    alt?: string;
  };
};

type VideoCarouselProps = {
  items: VideoCarouselItem[];
  orientation?: "horizontal" | "vertical";
  cardWidth?: number;
  cardHeight?: number;
  spacing?: number;
  depth?: number;
  perspective?: number;
  radius?: string;
  cardBackground?: string;
  showDots?: boolean;
  showButtons?: boolean;
  dotSize?: number;
  dotGap?: number;
  arrowSize?: number;
  arrowIconSize?: number;
  arrowStrokeWidth?: number;
  arrowInset?: number;
  autoAdvance?: boolean;
  autoAdvanceSeconds?: number;
  loop?: boolean;
  mutedDefault?: boolean;
  uiColor?: string;
  uiBackground?: string;
  inactiveBlur?: number;
  inactiveScale?: number;
  activeScale?: number;
  hoverZoom?: number;
  inactiveOpacity?: number;
  rotateAmount?: number;
  minimalChrome?: boolean;
  transition?: Transition;
  className?: string;
  style?: CSSProperties;
};

function clampIndex(index: number, count: number) {
  if (count <= 0) return 0;
  return Math.max(0, Math.min(count - 1, index));
}

function wrapIndex(index: number, count: number) {
  if (count <= 0) return 0;
  return ((index % count) + count) % count;
}

function getItemSrc(item: VideoCarouselItem) {
  if (!item) return "";
  if (item.sourceType === "upload") return item.upload || "";
  return item.url || "";
}

function isTruthyUrl(value: string) {
  return typeof value === "string" && value.trim().length > 0;
}

function toRgba(color: string, alpha: number) {
  const a = Math.max(0, Math.min(1, alpha));
  const c = String(color || "").trim();
  const rgbMatch = c.match(/^rgba?\(([^)]+)\)$/i);

  if (rgbMatch) {
    const parts = rgbMatch[1].split(",").map((part) => part.trim());
    const r = Number(parts[0]);
    const g = Number(parts[1]);
    const b = Number(parts[2]);
    if ([r, g, b].some(Number.isNaN)) return c;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  const hex = c.replace(/^#/, "");
  if (hex.length === 3 || hex.length === 6) {
    const full =
      hex.length === 3 ? hex.split("").map((ch) => ch + ch).join("") : hex;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return c;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  return c;
}

function ChevronIcon({
  dir,
  size = 18,
  strokeWidth = 2,
}: {
  dir: "prev" | "next";
  size?: number;
  strokeWidth?: number;
}) {
  const rot = dir === "prev" ? 180 : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <path
        d="M9 5l7 7-7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MuteIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M11 5L6 9H2v6h4l5 4V5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M16.5 9.5l5 5m0-5l-5 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M11 5L6 9H2v6h4l5 4V5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8.5a5 5 0 010 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18.5 5.5a9 9 0 010 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 36,
  mass: 0.8,
};

export function VideoCarousel({
  items,
  orientation = "horizontal",
  cardWidth = 420,
  cardHeight = 260,
  spacing = 74,
  depth = 260,
  perspective = 1000,
  radius = "16px",
  cardBackground = "#000000",
  showDots = true,
  showButtons = true,
  dotSize = 8,
  dotGap = 8,
  arrowSize = 36,
  arrowIconSize = 18,
  arrowStrokeWidth = 2,
  arrowInset = 12,
  autoAdvance = false,
  autoAdvanceSeconds = 4,
  loop = true,
  mutedDefault = true,
  uiColor = "#000000",
  uiBackground = "#FFFFFF",
  inactiveBlur = 10,
  inactiveScale = 0.92,
  activeScale = 1.08,
  hoverZoom = 1.03,
  inactiveOpacity = 1,
  rotateAmount = 18,
  minimalChrome = false,
  transition = defaultTransition,
  className = "",
  style,
}: VideoCarouselProps) {
  const reducedMotion = useReducedMotion();
  const count = items?.length ?? 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.35 });
  const [active, setActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [muted, setMuted] = useState(mutedDefault);
  const dragStart = useRef<{ x: number; y: number; active: number } | null>(
    null,
  );
  const videoEls = useRef<(HTMLVideoElement | null)[]>([]);

  const axis = orientation === "horizontal" ? "x" : "y";

  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      setWindowWidth(window.innerWidth);
    });
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scaleFactor = useMemo(() => {
    if (windowWidth >= 768) return 1;
    return Math.max(0.6, windowWidth / 768);
  }, [windowWidth]);

  const responsiveCardWidth = useMemo(() => cardWidth * scaleFactor, [cardWidth, scaleFactor]);
  const responsiveCardHeight = useMemo(() => cardHeight * scaleFactor, [cardHeight, scaleFactor]);
  const responsiveSpacing = useMemo(() => spacing * scaleFactor, [spacing, scaleFactor]);
  const responsiveDepth = useMemo(() => depth * scaleFactor, [depth, scaleFactor]);

  const goTo = useCallback(
    (nextRaw: number) => {
      if (count <= 0) return;
      const next = loop ? wrapIndex(nextRaw, count) : clampIndex(nextRaw, count);
      startTransition(() => setActive(next));
    },
    [count, loop],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (!autoAdvance || !inView || count <= 1 || isDragging) return;

    const ms = Math.max(0.5, autoAdvanceSeconds) * 1000;
    const id = window.setInterval(next, ms);
    return () => window.clearInterval(id);
  }, [autoAdvance, autoAdvanceSeconds, count, inView, isDragging, next]);

  useEffect(() => {
    if (count <= 0) return;
    if (active > count - 1) {
      startTransition(() => setActive(0));
    }
  }, [count, active]);

  useEffect(() => {
    if (!inView) {
      videoEls.current.forEach((video) => {
        try {
          video?.pause();
        } catch {
          /* noop */
        }
      });
      return;
    }

    videoEls.current.forEach((video, index) => {
      if (!video) return;
      const isActive = index === active;

      try {
        if (!isActive) {
          video.pause();
        } else {
          video.muted = muted;
          video.playsInline = true;
          video.loop = true;
          void video.play().catch(() => undefined);
        }
      } catch {
        /* noop */
      }
    });
  }, [active, inView, muted]);

  useEffect(() => {
    const video = videoEls.current[active];
    if (!video) return;
    try {
      video.muted = muted;
    } catch {
      /* noop */
    }
  }, [active, muted]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (count <= 1) return;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      startTransition(() => setIsDragging(true));
      dragStart.current = { x: event.clientX, y: event.clientY, active };
    },
    [active, count],
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStart.current) return;

      const start = dragStart.current;
      dragStart.current = null;
      startTransition(() => setIsDragging(false));

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      const delta = axis === "x" ? dx : dy;
      const threshold = 24;

      if (Math.abs(delta) < threshold) return;

      if (delta < 0) {
        goTo(start.active + 1);
      } else {
        goTo(start.active - 1);
      }
    },
    [axis, goTo],
  );

  const stackStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    touchAction: "pan-x pan-y",
    userSelect: "none",
    perspective: `${perspective}px`,
  };

  const stageSizeStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    minWidth: responsiveCardWidth + responsiveDepth + responsiveSpacing * 2,
    minHeight: responsiveCardHeight + responsiveDepth * 0.5,
    transformStyle: "preserve-3d",
  };

  const buttonStyle: CSSProperties = useMemo(() => ({
    appearance: "none",
    border: "none",
    background: uiBackground,
    color: uiColor,
    borderRadius: 999,
    width: arrowSize,
    height: arrowSize,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  }), [uiBackground, uiColor, arrowSize]);

  const overlayPillStyle: CSSProperties = useMemo(() => ({
    background: uiBackground,
    color: uiColor,
    borderRadius: 999,
    padding: "8px 10px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    pointerEvents: "auto",
  }), [uiBackground, uiColor]);

  const cards = useMemo(() => {
    const half = Math.floor(count / 2);

    return items.map((item, index) => {
      const rel = index - active;
      const relLooped =
        loop && count > 2
          ? (() => {
              let wrapped = rel;
              if (wrapped > half) wrapped -= count;
              if (wrapped < -half) wrapped += count;
              return wrapped;
            })()
          : rel;

      const abs = Math.abs(relLooped);
      // Use per-axis values so Framer Motion can interpolate each one smoothly
      const translateMain = relLooped * responsiveSpacing;
      const translateZ = -abs * responsiveDepth * 0.4;
      const rotateAxis = relLooped * -rotateAmount;

      const isActive = relLooped === 0;
      const src = getItemSrc(item);
      const hasVideo = isTruthyUrl(src);
      const targetScale = isActive
        ? activeScale
        : inactiveScale;
      const baseOpacity = abs > 3 ? 0 : 1 - Math.min(0.75, abs * 0.18);
      const targetOpacity = Math.max(
        0,
        Math.min(
          1,
          isActive
            ? baseOpacity
            : baseOpacity * Math.max(0, Math.min(1, inactiveOpacity)),
        ),
      );

      // Build animate object using individual transform axes — FM interpolates these per-axis
      const animateProps = reducedMotion
        ? { opacity: targetOpacity }
        : orientation === "horizontal"
          ? {
              opacity: targetOpacity,
              x: translateMain,
              z: translateZ,
              rotateY: rotateAxis,
              scale: targetScale,
            }
          : {
              opacity: targetOpacity,
              y: translateMain,
              z: translateZ,
              rotateX: -rotateAxis,
              scale: targetScale,
            };

      const hoverProps =
        !reducedMotion && isActive
          ? orientation === "horizontal"
            ? { scale: hoverZoom, x: translateMain, z: translateZ, rotateY: rotateAxis }
            : { scale: hoverZoom, y: translateMain, z: translateZ, rotateX: -rotateAxis }
          : undefined;

      return (
        <motion.div
          key={`${src}-${index}`}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: responsiveCardWidth,
            height: responsiveCardHeight,
            marginLeft: -responsiveCardWidth / 2,
            marginTop: -responsiveCardHeight / 2,
            borderRadius: radius,
            overflow: "hidden",
            background: cardBackground,
            transformStyle: "preserve-3d",
            pointerEvents: isActive ? "auto" : "none",
            boxShadow: isActive
              ? "0 40px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)"
              : "0 20px 40px rgba(0,0,0,0.35)",
          }}
          initial={false}
          animate={animateProps}
          transition={transition}
          whileHover={hoverProps}
        >
          {hasVideo ? (
            <Fragment>
              <video
                ref={(element) => {
                  videoEls.current[index] = element;
                }}
                src={src}
                poster={item.poster?.src}
                muted={index === active ? muted : true}
                playsInline
                preload="metadata"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                aria-label={item.poster?.alt || `Video ${index + 1}`}
              />
              {!isActive ? (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0.20))",
                    pointerEvents: "none",
                  }}
                />
              ) : null}
            </Fragment>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.85)",
                padding: 16,
                textAlign: "center",
                fontSize: 14,
              }}
            >
              Add a video URL or upload a video.
            </div>
          )}

          {isActive ? (
            <button
              type="button"
              aria-label={muted ? "Unmute video" : "Mute video"}
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                startTransition(() => setMuted((value) => !value));
              }}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                ...buttonStyle,
                width: 34,
                height: 34,
                pointerEvents: "auto",
              }}
            >
              <MuteIcon muted={muted} />
            </button>
          ) : null}
        </motion.div>
      );
    });
  }, [
    active,
    activeScale,
    buttonStyle,
    cardBackground,
    responsiveCardHeight,
    responsiveCardWidth,
    count,
    responsiveDepth,
    hoverZoom,
    inactiveOpacity,
    inactiveScale,
    items,
    loop,
    muted,
    orientation,
    radius,
    reducedMotion,
    rotateAmount,
    responsiveSpacing,
    transition,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <div
        style={stackStyle}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="region"
        aria-label="Video carousel"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowUp") prev();
          if (event.key === "ArrowRight" || event.key === "ArrowDown") next();
        }}
      >
        <div style={stageSizeStyle}>{cards}</div>

        {showButtons && count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous"
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                prev();
              }}
              style={{
                position: "absolute",
                left: arrowInset,
                top: "50%",
                transform: "translateY(-50%)",
                ...buttonStyle,
                pointerEvents: "auto",
              }}
            >
              <ChevronIcon
                dir="prev"
                size={arrowIconSize}
                strokeWidth={arrowStrokeWidth}
              />
            </button>
            <button
              type="button"
              aria-label="Next"
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                next();
              }}
              style={{
                position: "absolute",
                right: arrowInset,
                top: "50%",
                transform: "translateY(-50%)",
                ...buttonStyle,
                pointerEvents: "auto",
              }}
            >
              <ChevronIcon
                dir="next"
                size={arrowIconSize}
                strokeWidth={arrowStrokeWidth}
              />
            </button>
          </>
        ) : null}

        {showDots && count > 1 ? (
          <div
            style={{
              position: "absolute",
              left: 12,
              right: 12,
              bottom: minimalChrome ? -8 : 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                ...(minimalChrome ? { background: "transparent", padding: 0 } : overlayPillStyle),
                pointerEvents: "auto",
              }}
            >
              <div
                role="tablist"
                aria-label="Carousel navigation"
                style={{ display: "flex", gap: dotGap, alignItems: "center" }}
              >
                {items.map((_, index) => {
                  const isOn = index === active;
                  return (
                    <button
                      key={index}
                      type="button"
                      role="tab"
                      aria-selected={isOn}
                      aria-label={`Go to item ${index + 1}`}
                      onPointerDown={(event) => event.stopPropagation()}
                      onPointerUp={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.stopPropagation();
                        goTo(index);
                      }}
                      style={{
                        width: dotSize,
                        height: dotSize,
                        borderRadius: 999,
                        border: "none",
                        background: isOn ? uiColor : toRgba(uiColor, 0.25),
                        cursor: "pointer",
                        padding: 0,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
