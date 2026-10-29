"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { experienceConfig } from "@/lib/experience";
import { WorkCarousel } from "@/components/experience/WorkCarousel";
import {
  BuildingIcon,
  ChartIcon,
  ChipIcon,
  ClapperIcon,
  CloudIcon,
  CompassIcon,
  FilmIcon,
  LayersIcon,
  LoopIcon,
  MusicIcon,
  PenToolIcon,
  ShieldIcon,
  SparkIcon,
  TargetIcon,
  TrendIcon,
} from "@/components/ui/Icons";
import { stripStop } from "@/components/ui/accentTitle";
import { useI18n } from "@/lib/i18n/context";
import { getLocalizedPath } from "@/lib/i18n/config";
import { servicePillars } from "@/lib/service-pillars";

const whyIcons = [TargetIcon, LayersIcon, CompassIcon, ChartIcon];
const techIcons = [CloudIcon, ChipIcon, ShieldIcon, BuildingIcon];
const closingIcons = [SparkIcon, LoopIcon, TargetIcon];

const projectMeta = [
  {
    tone: "#9C1D28",
    Icon: FilmIcon,
    image: experienceConfig.portfolio[0].image,
  },
  {
    tone: "#6F9AD1",
    Icon: PenToolIcon,
    image: experienceConfig.portfolio[1].image,
  },
  {
    tone: "linear-gradient(90deg, #574622, #374F44)",
    Icon: ClapperIcon,
    image: experienceConfig.portfolio[2].image,
  },
  {
    tone: "linear-gradient(90deg, #33262A, #422733)",
    Icon: MusicIcon,
    image: experienceConfig.portfolio[3].image,
  },
];

export function HomeRedesign() {
  const { dict, locale } = useI18n();
  const heroDict = dict.home.hero;
  const { whyUs, whatWeDo, tech, why, process, finalCta } = dict.home;
  const workDict = dict.home.work;

  const contactHref = getLocalizedPath("/contact", locale);
  const servicesHref = getLocalizedPath("/services", locale);

  const projects = workDict.projects.map((proj, idx) => ({
    ...proj,
    image: projectMeta[idx]?.image || experienceConfig.portfolio[idx]?.image,
    tone: projectMeta[idx]?.tone || "#9C1D28",
    Icon: projectMeta[idx]?.Icon || FilmIcon,
  }));

  // Draw the process line once the steps scroll into view (the class is added only after JS runs,
  // so without JS the steps simply show)
  const processRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const steps = processRef.current;
    if (!steps) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      steps.classList.add("is-drawn");
      return;
    }
    steps.classList.add("will-draw");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          steps.classList.add("is-drawn");
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(steps);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-redesign">
      <section className="home-hero" data-section-theme="dark" aria-labelledby="home-title">
        <div className="home-shell home-hero-inner">
          <p className="home-eyebrow">{heroDict.eyebrow}</p>
          <h1 id="home-title">
            {heroDict.titlePart1}
            <em>{heroDict.titlePart2 ? heroDict.titleEmphasis : stripStop(heroDict.titleEmphasis)}</em>
            {stripStop(heroDict.titlePart2)}
          </h1>
          <p className="home-intro home-tagline">{heroDict.tagline}</p>
          <p className="home-intro home-hero-intro">{heroDict.intro}</p>
          <div className="home-actions">
            <Link className="home-button home-button-primary" href={contactHref}>
              {heroDict.discussProject}
            </Link>
            <a className="home-button home-button-secondary" href="#our-work">
              {heroDict.exploreWork}
            </a>
          </div>
        </div>
      </section>

      <section className="home-why-us" data-section-theme="dark" aria-labelledby="why-us-title">
        <div className="home-shell">
          <div className="home-section-head home-split-head">
            <p className="home-eyebrow">{whyUs.eyebrow}</p>
            <h2 id="why-us-title">
              {whyUs.titlePart1}
              <em>{stripStop(whyUs.titleEmphasis)}</em>
            </h2>
            <p>{whyUs.text}</p>
          </div>
        </div>
      </section>

      <section id="services" className="home-pillars" data-section-theme="dark" aria-labelledby="pillars-title">
        <div className="home-shell">
          <div className="home-section-head home-split-head">
            <p className="home-eyebrow">{whatWeDo.eyebrow}</p>
            <h2 id="pillars-title">
              {whatWeDo.titlePart1}
              <em>{stripStop(whatWeDo.titleEmphasis)}</em>
            </h2>
            <p>{whatWeDo.subheading}</p>
          </div>
          {/* Four pillar cards: a row on desktop, stacked on mobile; each opens its Services page section */}
          <ol className="offer-grid">
            {whatWeDo.items.map((item, index) => {
              const pillar = servicePillars[index];
              return (
                <li className="offer-card" key={item.title}>
                  <figure className="offer-image">
                    <Image
                      src={pillar.image}
                      alt={item.alt}
                      width={640}
                      height={800}
                      sizes="(max-width: 700px) 92vw, (max-width: 1000px) 46vw, 270px"
                    />
                  </figure>
                  <div className="offer-copy">
                    <span className="offer-number">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{stripStop(item.title)}</h3>
                    <p>{item.description}</p>
                    <Link className="offer-link" href={`${servicesHref}#${pillar.slug}`}>
                      {whatWeDo.exploreLabel} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="offer-cta">
            <div>
              <h3>{stripStop(whatWeDo.ctaTitle)}</h3>
              <p>{whatWeDo.ctaText}</p>
            </div>
            {/* Same golden pill and label as the header's "Book a Consultation" */}
            <Link className="localized-ui-text lgl-gold-cta offer-cta-button" href={contactHref}>
              {dict.nav.cta} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="technology" className="home-tech" data-section-theme="dark" aria-labelledby="tech-title">
        <div className="home-shell">
          <div className="home-section-head home-split-head">
            <p className="home-eyebrow">{tech.eyebrow}</p>
            <h2 id="tech-title">
              {tech.titlePart1}
              <em>{stripStop(tech.titleEmphasis)}</em>
            </h2>
            <div className="tech-copy">
              {tech.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ul className="tech-grid">
            {tech.items.map((item, index) => {
              const SectorIcon = techIcons[index % techIcons.length];
              return (
                <li className="tech-item" key={item.title} data-index={String(index + 1).padStart(2, "0")}>
                  <span className="tech-icon">
                    <SectorIcon size={20} />
                  </span>
                  <h3>{stripStop(item.title)}</h3>
                  <p>{item.description}</p>
                </li>
              );
            })}
          </ul>
          {/* Opens the Technology & Product Marketing pillar on the Services page */}
          <div className="tech-actions">
            <Link className="home-button home-button-secondary" href={`${servicesHref}#technology-product`}>
              {tech.cta} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="our-work" className="home-work" data-section-theme="dark" aria-labelledby="work-title">
        <div className="home-shell">
          <div className="work-heading">
            <div>
              <p className="home-eyebrow">{workDict.eyebrow}</p>
              <h2 id="work-title">
                {workDict.titlePart1}
                <em>{stripStop(workDict.titleEmphasis)}</em>
              </h2>
            </div>
            <p>{workDict.subheading}</p>
          </div>
          <WorkCarousel>
            {projects.map((project, index) => (
              <article
                className={`work-card-content work-feature-${index + 1}`}
                key={project.slug}
                data-project-id={project.slug}
                style={{ "--work-tone": project.tone } as CSSProperties}
              >
                <figure className="work-image">
                  <img src={project.image} alt={project.alt} loading="lazy" decoding="async" draggable={false} />
                </figure>
                <div className="work-copy">
                  <p className="home-eyebrow">
                    <project.Icon className="work-icon" size={16} />
                    {project.category.replace(/\s*\/\s*/g, " · ")}
                  </p>
                  <h3>{project.client}</h3>
                  <p className="work-challenge">
                    <strong>
                      <TargetIcon size={13} />
                      {workDict.challengeLabel}
                    </strong>
                    {project.challenge}
                  </p>
                  <div className="work-outcome">
                    <strong>
                      <TrendIcon size={13} />
                      {workDict.outcomeLabel}
                    </strong>
                    <ul>
                      {project.outcome.map((result) => (
                        <li key={result}>{result}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </WorkCarousel>
        </div>
      </section>

      <section className="home-why" data-section-theme="dark" aria-labelledby="why-title">
        <div className="home-shell">
          <div className="home-section-head home-split-head">
            <p className="home-eyebrow">{why.eyebrow}</p>
            <h2 id="why-title">
              {why.titlePart1}
              <em>{stripStop(why.titleEmphasis)}</em>
            </h2>
            <p>{why.intro}</p>
          </div>
          <h3 className="why-points-heading">{why.pointsHeading}</h3>
          <ol className="why-grid">
            {why.points.map((point, index) => {
              const PointIcon = whyIcons[index % whyIcons.length];
              return (
                <li className="why-card" key={point.title}>
                  <div className="why-card-top">
                    <span className="why-icon">
                      <PointIcon size={20} />
                    </span>
                    <span className="why-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3>{stripStop(point.title)}</h3>
                  <p>{point.description}</p>
                </li>
              );
            })}
          </ol>
          {/* Closing line: three equal tiles, each an icon badge above its phrase, then the primary CTA */}
          <div className="why-closing">
            <ul className="why-closing-list">
              {why.closing.map((phrase, index) => {
                const ClosingIcon = closingIcons[index % closingIcons.length];
                return (
                  <li key={phrase}>
                    <span className="why-closing-icon">
                      <ClosingIcon size={22} />
                    </span>
                    <span className="why-closing-text">{stripStop(phrase)}</span>
                  </li>
                );
              })}
            </ul>
            <Link className="home-button home-button-primary" href={contactHref}>
              {heroDict.discussProject}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-process" data-section-theme="dark" aria-labelledby="process-title">
        <div className="home-shell">
          {/* Heading beside its intro, like the other homepage sections */}
          <div className="home-section-head home-split-head">
            <p className="home-eyebrow">{process.eyebrow}</p>
            <h2 id="process-title">
              {process.titlePart1}
              <em>{stripStop(process.titleEmphasis)}</em>
            </h2>
            <p>{process.intro}</p>
          </div>
          {/* Four steps: a row on desktop, a vertical timeline on mobile */}
          <ol className="process-steps" ref={processRef}>
            <li className="process-runner" aria-hidden="true" />
            {process.steps.map((step, index) => (
              <li className="process-step" key={step.title} style={{ "--step": index } as CSSProperties}>
                <span className="process-marker" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{stripStop(step.title)}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-final" data-section-theme="dark" aria-labelledby="final-title">
        <div className="home-shell">
          <div className="final-card">
            <div className="home-section-head">
              <h2 id="final-title">{stripStop(finalCta.title)}</h2>
              <p>{finalCta.text}</p>
            </div>
            <div className="home-actions">
              <Link className="home-button home-button-primary" href={contactHref}>
                {finalCta.button}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
