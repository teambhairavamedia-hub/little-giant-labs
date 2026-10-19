"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

/* Horizontal, snap-scrolling track for the Selected Work cards: swipe on touch,
   trackpad/shift-wheel or drag with a mouse, or use the arrow buttons. */
export function WorkCarousel({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 });
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setProgress(max > 0 ? track.scrollLeft / max : 1);
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(track.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  /* Scroll to the next/previous card start (cards differ in width, so use their real positions) */
  const step = (direction: 1 | -1, from?: number) => {
    const track = trackRef.current;
    if (!track) return;
    const origin = from ?? track.scrollLeft;
    const max = track.scrollWidth - track.clientWidth;
    const trackLeft = track.getBoundingClientRect().left;
    const points = Array.from(track.children, (card) =>
      Math.min(max, card.getBoundingClientRect().left - trackLeft + track.scrollLeft),
    );
    const target = direction === 1
      ? points.find((point) => point > origin + 4) ?? max
      : [...points].reverse().find((point) => point < origin - 4) ?? 0;
    track.scrollTo({ left: target, behavior: "smooth" });
  };

  /* Mouse drag-to-scroll; touch and pen keep native swiping */
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = { active: true, moved: false, startX: event.clientX, startScroll: track.scrollLeft };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!drag.current.active || !track) return;
    const dx = event.clientX - drag.current.startX;
    if (!drag.current.moved && Math.abs(dx) > 5) {
      drag.current.moved = true;
      track.setPointerCapture(event.pointerId);
      track.classList.add("is-dragging");
    }
    if (drag.current.moved) track.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!drag.current.active || !track) return;
    drag.current.active = false;
    if (drag.current.moved) {
      track.releasePointerCapture(event.pointerId);
      track.classList.remove("is-dragging");
      // A deliberate drag commits to the next card in that direction instead of snapping back
      const dx = event.clientX - drag.current.startX;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1, drag.current.startScroll);
    }
  };

  return (
    <div className="work-carousel">
      <div
        ref={trackRef}
        className="work-list"
        role="region"
        aria-label="Selected work projects"
        tabIndex={0}
        data-lenis-prevent-horizontal
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {children}
      </div>
      <div className="work-controls">
        <div className="work-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.max(progress, 0.04)})` }} />
        </div>
        <div className="work-arrows">
          <button type="button" className="work-arrow" onClick={() => step(-1)} disabled={atStart} aria-label="Previous project">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" className="work-arrow" onClick={() => step(1)} disabled={atEnd} aria-label="Next project">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
