"use client";

import { useEffect, useRef, useState } from "react";
import { resolveRemoteMediaUrl } from "@/lib/media";
import { mediaUrls } from "@/lib/media-paths";
import { useI18n } from "@/lib/i18n/context";

const cardVideos = [
  resolveRemoteMediaUrl(mediaUrls.service01),
  resolveRemoteMediaUrl(mediaUrls.service02),
  resolveRemoteMediaUrl(mediaUrls.service03),
];

export function ServiceVideoCards() {
  const { dict } = useI18n();
  const serviceDict = dict.home.services;
  const cards = serviceDict.cards;

  const listRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const slideRef = useRef(0);
  const [active, setActive] = useState<number | null>(null);
  const [failed, setFailed] = useState<number[]>([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const videos = videoRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && entry.target instanceof HTMLVideoElement) {
            entry.target.pause();
            const index = videos.indexOf(entry.target);
            setActive((current) => (current === index ? null : current));
          }
        });
      },
      { threshold: 0.2 }
    );
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
    } catch {
      /* The paused card and its text remain usable if playback is unavailable. */
    }
  };

  const deactivate = (index: number) => {
    videoRefs.current[index]?.pause();
    setActive((current) => (current === index ? null : current));
  };

  const moveTo = (index: number) => {
    const next = Math.max(0, Math.min(cards.length - 1, index));
    slideRef.current = next;
    setSlide(next);
    listRef.current?.children[next]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
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
      const closestDistance = Math.abs(
        (list.children[closest] as HTMLElement).getBoundingClientRect().left - listLeft
      );
      return distance < closestDistance ? index : closest;
    }, 0);
    if (slideRef.current !== next) {
      slideRef.current = next;
      videoRefs.current.forEach((video, index) => {
        if (index !== next) video?.pause();
      });
      void activate(next);
      setSlide(next);
    }
  };

  return (
    <>
      <div
        className="service-video-list"
        ref={listRef}
        onScroll={syncSlide}
        aria-label={serviceDict.ariaServices}
      >
        {cards.map((card, index) => {
          const videoSrc = cardVideos[index % cardVideos.length];
          return (
            <article
              className={`service-video-card${active === index ? " is-active" : ""}`}
              key={card.number}
              role="button"
              tabIndex={0}
              aria-label={`${card.number}: ${card.title}. ${card.description}`}
              aria-pressed={active === index}
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") void activate(index);
              }}
              onPointerLeave={(event) => {
                const nextCard =
                  event.relatedTarget instanceof Element
                    ? event.relatedTarget.closest(".service-video-card")
                    : null;
                if (!nextCard) deactivate(index);
              }}
              onFocus={() => void activate(index)}
              onBlur={(event) => {
                if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null))
                  deactivate(index);
              }}
              onClick={(event) => {
                if (event.detail > 0 && window.matchMedia("(max-width: 700px)").matches)
                  void activate(index);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  void activate(index);
                }
                if (event.key === "Escape") deactivate(index);
              }}
            >
              {!failed.includes(index) && (
                <video
                  ref={(node) => {
                    videoRefs.current[index] = node;
                  }}
                  className="service-video-media"
                  src={videoSrc}
                  muted
                  playsInline
                  preload="metadata"
                  loop
                  aria-hidden="true"
                  onError={() =>
                    setFailed((current) => (current.includes(index) ? current : [...current, index]))
                  }
                />
              )}
              <div className="service-video-gradient" aria-hidden="true" />
              <div className="service-video-copy">
                <p className="home-eyebrow">
                  <span /> {card.number} / {card.title}
                </p>
                <h3>{card.scene}</h3>
                <p>{card.description}</p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="service-video-controls" aria-label="Service carousel controls">
        <button
          className="work-arrow cursor-pointer"
          type="button"
          onClick={() => moveTo(slide - 1)}
          disabled={slide === 0}
          aria-label={serviceDict.prevService}
        >
          ←
        </button>
        <div className="service-video-dots" role="group" aria-label={serviceDict.chooseService}>
          {cards.map((card, index) => (
            <button
              key={card.number}
              type="button"
              className="cursor-pointer"
              aria-label={`${serviceDict.chooseService}: ${card.title}`}
              aria-current={slide === index ? "true" : undefined}
              onClick={() => moveTo(index)}
            />
          ))}
        </div>
        <button
          className="work-arrow cursor-pointer"
          type="button"
          onClick={() => moveTo(slide + 1)}
          disabled={slide === cards.length - 1}
          aria-label={serviceDict.nextService}
        >
          →
        </button>
      </div>
    </>
  );
}
