"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { experienceConfig } from "@/lib/experience";
import { ServiceVideoCards } from "@/components/experience/ServiceVideoCards";
import { WorkCarousel } from "@/components/experience/WorkCarousel";
import { ClapperIcon, FilmIcon, MusicIcon, PenToolIcon, TargetIcon, TrendIcon } from "@/components/ui/Icons";
import { useI18n } from "@/lib/i18n/context";
import { getLocalizedPath } from "@/lib/i18n/config";

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
  const servicesDict = dict.home.services;
  const workDict = dict.home.work;

  const contactHref = getLocalizedPath("/contact", locale);

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
          <p className="home-intro">{heroDict.intro}</p>
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
          <div className="home-section-head">
            <p className="home-eyebrow">{servicesDict.eyebrow}</p>
            <h2 id="pillars-title">
              {servicesDict.titlePart1}
              <em>{servicesDict.titleEmphasis}</em>
            </h2>
            <p>{servicesDict.subheading}</p>
          </div>
          <ServiceVideoCards />
          <p className="home-transition">
            <span /> {servicesDict.transition}
          </p>
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
    </div>
  );
}
