"use client";

import { useEffect, useRef, useState } from "react";

const cards = [
  {
    number: "01",
    title: "Attention Engineering",
    scene: "Make them look",
    description: "Data-backed, high-production visual assets built to capture and retain modern consumer attention spans.",
    src: "/media/Little%20Giant%20Labs%20-%20service-01.mp4",
  },
  {
    number: "02",
    title: "Performance Architecture",
    scene: "Make it perform",
    description: "Algorithmic media buying stacks optimized for predictable corporate revenue multiplication.",
    src: "/media/Little%20Giant%20Labs%20-%20service-02.mp4",
  },
  {
    number: "03",
    title: "Autonomous Lifecycle Loops",
    scene: "Make it last",
    description: "AI-powered CRM setups and custom data tracking systems that automate consumer retention.",
    src: "/media/Little%20Giant%20Labs%20-%20service-03.mp4",
  },
];

export function ServiceVideoCards() {
  const listRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const slideRef = useRef(0);
  const [active, setActive] = useState<number | null>(null);
  const [failed, setFailed] = useState<number[]>([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const videos = videoRefs.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && entry.target instanceof HTMLVideoElement) {
          entry.target.pause();
          const index = videos.indexOf(entry.target);
          setActive((current) => current === index ? null : current);
        }
      });
    }, { threshold: 0.2 });
    videos.forEach((video) => video && observer.observe(video));
    return () => observer.disconnect();
  }, []);

  const activate = async (index: number) => {
    const video = videoRefs.current[index];
    videoRefs.current.forEach((other, otherIndex) => {
      if (otherIndex !== index) other?.pause();
    });
    setActive(index);
    if (!video || failed.includes(index)) return;
    try {
      await video.play();
    } catch { /* The paused card and its text remain usable if playback is unavailable. */ }
  };

  const deactivate = (index: number) => {
    videoRefs.current[index]?.pause();
    setActive((current) => current === index ? null : current);
  };

  const moveTo = (index: number) => {
    const next = Math.max(0, Math.min(cards.length - 1, index));
    slideRef.current = next;
    setSlide(next);
    listRef.current?.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    videoRefs.current.forEach((video, videoIndex) => {
      if (videoIndex !== next) video?.pause();
    });
    void activate(next);
  };

  const syncSlide = () => {
    const list = listRef.current;
    if (!list) return;
    const listLeft = list.getBoundingClientRect().left;
    const next = Array.from(list.children).reduce((closest, child, index) => {
      const distance = Math.abs((child as HTMLElement).getBoundingClientRect().left - listLeft);
      const closestDistance = Math.abs((list.children[closest] as HTMLElement).getBoundingClientRect().left - listLeft);
      return distance < closestDistance ? index : closest;
    }, 0);
    if (slideRef.current !== next) {
      slideRef.current = next;
      videoRefs.current.forEach((video, index) => { if (index !== next) video?.pause(); });
      void activate(next);
      setSlide(next);
    }
  };

  return (
    <>
      <div className="service-video-list" ref={listRef} onScroll={syncSlide} aria-label="Our services">
        {cards.map((card, index) => (
          <article
            className={`service-video-card${active === index ? " is-active" : ""}`}
            key={card.number}
            role="button"
            tabIndex={0}
            aria-label={`${card.number}: ${card.title}. ${card.description}`}
            aria-pressed={active === index}
            onPointerEnter={(event) => { if (event.pointerType !== "touch") void activate(index); }}
            onPointerLeave={(event) => {
              const nextCard = event.relatedTarget instanceof Element ? event.relatedTarget.closest(".service-video-card") : null;
              if (!nextCard) deactivate(index);
            }}
            onFocus={() => void activate(index)}
            onBlur={(event) => {
              if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) deactivate(index);
            }}
            onClick={(event) => { if (event.detail > 0 && window.matchMedia("(max-width: 700px)").matches) void activate(index); }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") { event.preventDefault(); void activate(index); }
              if (event.key === "Escape") deactivate(index);
            }}
          >
            {!failed.includes(index) && (
              <video
                ref={(node) => { videoRefs.current[index] = node; }}
                className="service-video-media"
                src={card.src}
                muted
                playsInline
                preload="metadata"
                loop
                aria-hidden="true"
                onError={() => setFailed((current) => current.includes(index) ? current : [...current, index])}
              />
            )}
            <div className="service-video-gradient" aria-hidden="true" />
            <div className="service-video-copy">
              <p className="home-eyebrow"><span /> {card.number} / {card.title}</p>
              <h3>{card.scene}</h3>
              <p>{card.description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="service-video-controls" aria-label="Service carousel controls">
        <button className="work-arrow" type="button" onClick={() => moveTo(slide - 1)} disabled={slide === 0} aria-label="Previous service">←</button>
        <div className="service-video-dots" role="group" aria-label="Choose a service">
          {cards.map((card, index) => <button key={card.number} type="button" aria-label={`Show ${card.title}`} aria-current={slide === index ? "true" : undefined} onClick={() => moveTo(index)} />)}
        </div>
        <button className="work-arrow" type="button" onClick={() => moveTo(slide + 1)} disabled={slide === cards.length - 1} aria-label="Next service">→</button>
      </div>
    </>
  );
}
