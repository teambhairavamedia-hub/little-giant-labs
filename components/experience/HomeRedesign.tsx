"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { experienceConfig } from "@/lib/experience";
import { WorkCarousel } from "@/components/experience/WorkCarousel";
import {
  ChartIcon,
  ClapperIcon,
  CompassIcon,
  FilmIcon,
  LayersIcon,
  MusicIcon,
  PenToolIcon,
  TargetIcon,
  TrendIcon,
} from "@/components/ui/Icons";
import { useI18n } from "@/lib/i18n/context";
import { getLocalizedPath } from "@/lib/i18n/config";
import { servicePillars } from "@/lib/service-pillars";

const whyIcons = [TargetIcon, LayersIcon, CompassIcon, ChartIcon];

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
  const { whatWeDo, why, process, finalCta } = dict.home;
  const workDict = dict.home.work;

  const contactHref = getLocalizedPath("/contact", locale);
  const servicesHref = getLocalizedPath("/services", locale);

  const projects = workDict.projects.map((proj, idx) => ({
    ...proj,
    image: projectMeta[idx]?.image || experienceConfig.portfolio[idx]?.image,
    tone: projectMeta[idx]?.tone || "#9C1D28",
    Icon: projectMeta[idx]?.Icon || FilmIcon,
  }));

  return (
    <div className="home-redesign">
      <section className="home-hero" data-section-theme="dark" aria-labelledby="home-title">
        <div className="home-shell home-hero-inner">
          <p className="home-eyebrow">{heroDict.eyebrow}</p>
          <h1 id="home-title">
            {heroDict.titlePart1}
            <em>{heroDict.titleEmphasis}</em>
            {heroDict.titlePart2}
          </h1>
          <p className="home-intro home-tagline">{heroDict.tagline}</p>
          <p className="home-intro home-hero-intro">{heroDict.intro}</p>
          <div className="home-actions">
            <Link className="home-button home-button-primary" href={contactHref}>
              {heroDict.discussProject} <span aria-hidden="true">↗</span>
            </Link>
            <a className="home-button home-button-secondary" href="#our-work">
              {heroDict.exploreWork}
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="home-pillars" data-section-theme="dark" aria-labelledby="pillars-title">
        <div className="home-shell">
          <div className="home-section-head home-split-head">
            <p className="home-eyebrow">{whatWeDo.eyebrow}</p>
            <h2 id="pillars-title">
              {whatWeDo.titlePart1}
              <em>{whatWeDo.titleEmphasis}</em>
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
                    <h3>{item.title}</h3>
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
              <h3>{whatWeDo.ctaTitle}</h3>
              <p>{whatWeDo.ctaText}</p>
            </div>
            {/* Same golden pill and label as the header's "Book a Consultation" */}
            <Link className="localized-ui-text lgl-gold-cta offer-cta-button" href={contactHref}>
              {dict.nav.cta} <span aria-hidden="true">→</span>
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
                <em>{workDict.titleEmphasis}</em>
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
                    {project.category}
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
          <div className="home-section-head why-head">
            <p className="home-eyebrow">{why.eyebrow}</p>
            <h2 id="why-title">
              {why.titlePart1}
              <em>{why.titleEmphasis}</em>
            </h2>
            <p>{why.intro}</p>
          </div>
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
                  <h3>{point.title}</h3>
                  <p>{point.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="home-process" data-section-theme="dark" aria-labelledby="process-title">
        <div className="home-shell">
          <div className="home-section-head">
            <p className="home-eyebrow">{process.eyebrow}</p>
            <h2 id="process-title">
              {process.titlePart1}
              <em>{process.titleEmphasis}</em>
            </h2>
            <p>{process.intro}</p>
          </div>
          {/* Four steps: a row on desktop, a vertical timeline on mobile */}
          <ol className="process-steps">
            {process.steps.map((step, index) => (
              <li className="process-step" key={step.title}>
                <span className="process-marker" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-final" data-section-theme="dark" aria-labelledby="final-title">
        <div className="home-shell">
          <div className="final-card lgl-brand-card">
            <div className="home-section-head">
              <h2 id="final-title">{finalCta.title}</h2>
              <p>{finalCta.text}</p>
            </div>
            <div className="home-actions">
              <Link className="home-button home-button-primary" href={contactHref}>
                {finalCta.button} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
