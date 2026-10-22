"use client";

import { Children, useEffect, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode, type WheelEvent } from "react";

type NavigationRequest = { type: "step"; delta: -1 | 1 } | { type: "select"; id: string };

function getProjectId(card: ReactNode, index: number): string {
  if (card && typeof card === "object" && "props" in card) {
    const id = (card as ReactElement<{ "data-project-id"?: string }>).props["data-project-id"];
    if (id) return id;
  }
  return `project-${index}`;
}

/* The active project stays centered while its circular neighbors occupy the
   two preview positions. The fourth card remains reachable through navigation. */
export function WorkCarousel({ children }: { children: ReactNode }) {
  const cards = Children.toArray(children);
  const count = cards.length;
  const projectIds = cards.map(getProjectId);
  const [activeIndex, setActiveIndex] = useState(0);
  const gestureLock = useRef(false);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const navigate = (request: NavigationRequest) => {
    setActiveIndex((current) => {
      if (!count) return 0;
      if (request.type === "step") return (current + request.delta + count) % count;
      const target = projectIds.indexOf(request.id);
      return target < 0 ? current : target;
    });
  };
  const step = (delta: -1 | 1) => navigate({ type: "step", delta });
  const select = (id: string) => navigate({ type: "select", id });

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
  };
  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) < 45 || Math.abs(event.deltaX) < Math.abs(event.deltaY) * 1.2) return;
    if (unlockTimer.current) clearTimeout(unlockTimer.current);
    unlockTimer.current = setTimeout(() => { gestureLock.current = false; }, 220);
    if (gestureLock.current) return;
    gestureLock.current = true;
    step(event.deltaX > 0 ? 1 : -1);
  };
  useEffect(() => () => { if (unlockTimer.current) clearTimeout(unlockTimer.current); }, []);

  return (
    <div className="work-carousel">
      <div className="work-list" role="region" aria-label="Selected work projects" tabIndex={0} onKeyDown={onKeyDown} onWheel={onWheel}
        onTouchStart={(event) => { const touch = event.touches[0]; touchStart.current = { x: touch.clientX, y: touch.clientY }; }}
        onTouchEnd={(event) => {
          if (!touchStart.current) return;
          const dx = event.changedTouches[0].clientX - touchStart.current.x;
          const dy = event.changedTouches[0].clientY - touchStart.current.y;
          if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.25) step(dx < 0 ? 1 : -1);
          touchStart.current = null;
        }}>
        {cards.map((card, projectIndex) => {
          const projectId = projectIds[projectIndex];
          const selected = projectIndex === activeIndex;
          const offset = (projectIndex - activeIndex + count) % count;
          const position = selected ? "center" : offset === 1 ? "right" : offset === count - 1 ? "left" : "hidden";
          return (
            <div key={projectId} className={`work-slide work-slide--${position}${selected ? " is-active" : ""}`} role="button" tabIndex={position === "hidden" ? -1 : 0}
              aria-label={`Select ${projectId}, project ${projectIndex + 1} of ${count}`}
              aria-hidden={position === "hidden"}
              aria-current={selected ? "true" : undefined}
              onClick={() => select(projectId)}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(projectId); } }}>
              <div className={`work-feature${selected ? " is-active" : ""}`} data-active={selected}>{card}</div>
            </div>
          );
        })}
      </div>
      <div className="work-controls">
        <div className="work-progress" role="group" aria-label="Choose a project">
          {projectIds.map((id, index) => <button key={id} type="button" className={`work-progress-step${index === activeIndex ? " is-active" : ""}`} aria-label={`Show project ${index + 1} of ${count}`} aria-current={index === activeIndex ? "step" : undefined} onClick={() => select(id)} />)}
        </div>
        <div className="work-arrows">
          <button type="button" className="work-arrow" onClick={() => step(-1)} aria-label="Previous project"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
          <button type="button" className="work-arrow" onClick={() => step(1)} aria-label="Next project"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
        </div>
      </div>
      <span className="sr-only" aria-live="polite">Project {activeIndex + 1} of {count}</span>
    </div>
  );
}
