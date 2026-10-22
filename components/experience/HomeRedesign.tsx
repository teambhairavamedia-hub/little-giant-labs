import Link from "next/link";
import type { CSSProperties } from "react";
import { experienceConfig } from "@/lib/experience";
import { ServiceVideoCards } from "@/components/experience/ServiceVideoCards";
import { WorkCarousel } from "@/components/experience/WorkCarousel";
import { ClapperIcon, FilmIcon, MusicIcon, PenToolIcon, TargetIcon, TrendIcon } from "@/components/ui/Icons";

const projects = [
  {
    slug: "idfc-first-bank", client: "IDFC FIRST Bank: Emerging Banker Program", category: "Corporate film / recruitment branding",
    challenge: "Attract financial talent across India through a recruitment and branding showcase.",
    approach: "Cinematic storytelling around career acceleration, employee culture, and financial leadership, supported by multi-channel video assets and landing-page media.",
    image: experienceConfig.portfolio[0].image,
    outcome: experienceConfig.portfolio[0].results,
    tone: "#9C1D28",
    alt: "IDFC FIRST Bank logo with the tagline “Always You First” on a red background",
    Icon: FilmIcon,
  },
  {
    slug: "quberx-brand-identity", client: "Quberx: Brand Identity", category: "Brand identity",
    challenge: "Develop a modern brand system and asset library to position Quberx as a technology innovator.",
    approach: "Custom visual identity guidelines, digital interface concepts, and marketing creative.",
    image: experienceConfig.portfolio[1].image,
    outcome: experienceConfig.portfolio[1].results,
    tone: "#6F9AD1",
    alt: "Quberx social creative reading “Be prepared for every move.” beside glossy blue Bitcoin coins",
    Icon: PenToolIcon,
  },
  {
    slug: "adhyaksh-film-shoot", client: "Adhyaksh: Bhairava Films", category: "Film announcement campaign",
    challenge: "Produce an official announcement shoot with promotional posters and social creative.",
    approach: "Creative direction, set design, portrait photography, promotional assets, and digital rollout.",
    image: experienceConfig.portfolio[2].image,
    outcome: experienceConfig.portfolio[2].results,
    tone: "linear-gradient(90deg, #574622, #374F44)",
    alt: "Adhyaksh film poster by Bhairava Films: the lead in a beige jacket and sunglasses with his crew, under the red Devanagari title",
    Icon: ClapperIcon,
  },
  {
    slug: "anthem-launch", client: "Anthem Launch: Danny Pandit & Brahmaa", category: "Music promotion / social campaign",
    challenge: "Build momentum and audience traction for an official anthem launch.",
    approach: "Social hooks, creative teasers, and multi-format promotional campaigns across Instagram and YouTube.",
    image: experienceConfig.portfolio[3].image,
    outcome: experienceConfig.portfolio[3].results,
    tone: "linear-gradient(90deg, #33262A, #422733)",
    alt: "“Zat Pat Pata Pat” song poster: Danny Pandit in an orange jacket and glowing sunglasses before a bright mandala, releasing 28 November",
    Icon: MusicIcon,
  },
];

export function HomeRedesign() {
  return (
    <div className="home-redesign">
      <section className="home-hero" data-section-theme="dark" aria-labelledby="home-title">
        <div className="home-shell home-hero-inner">
          <p className="home-eyebrow">Intellect. Media. Capital.</p>
          <h1 id="home-title">We Engineer Digital Monopolies for Enterprise <em>Brands</em></h1>
          <p className="home-intro">A closed-loop growth laboratory combining deep data analytics, high-retention media engineering, and AI-driven lifecycle automation.</p>
          <div className="home-actions">
            <Link className="home-button home-button-primary" href="/contact">Discuss Your Project <span aria-hidden="true">↗</span></Link>
            <a className="home-button home-button-secondary" href="#our-work">Explore Our Work</a>
          </div>
          <span className="home-index"><i /> The growth system</span>
        </div>
      </section>

      <section id="services" className="home-pillars" data-section-theme="dark" aria-labelledby="pillars-title">
        <div className="home-shell">
          <div className="home-section-head">
            <p className="home-eyebrow">One connected growth system</p>
            <h2 id="pillars-title">Attention becomes <em>momentum</em></h2>
            <p>Production, distribution, and retention work as one continuous engine.</p>
          </div>
          <ServiceVideoCards />
          <p className="home-transition"><span /> From attention to lasting value</p>
        </div>
      </section>

      <section id="our-work" className="home-work" data-section-theme="dark" aria-labelledby="work-title">
        <div className="home-shell">
          <div className="work-heading">
            <div><p className="home-eyebrow">Selected work</p><h2 id="work-title">Built in the <em>real world</em></h2></div>
            <p>Creative direction and media systems shaped around each project’s ambition.</p>
          </div>
          <WorkCarousel>
            {projects.map((project, index) => (
              <article className={`work-card-content work-feature-${index + 1}`} key={project.slug} data-project-id={project.slug} style={{ "--work-tone": project.tone } as CSSProperties}>
                <figure className="work-image"><img src={project.image} alt={project.alt} loading="lazy" decoding="async" draggable={false} /></figure>
                <div className="work-copy">
                  <p className="home-eyebrow"><project.Icon className="work-icon" size={16} />{project.category}</p>
                  <h3>{project.client}</h3>
                  <p className="work-challenge"><strong><TargetIcon size={13} />Challenge</strong>{project.challenge}</p>
                  <div className="work-outcome"><strong><TrendIcon size={13} />Outcome</strong><ul>{project.outcome.map((result) => <li key={result}>{result}</li>)}</ul></div>
                </div>
              </article>
            ))}
          </WorkCarousel>
          {/* The separate work archive is temporarily unavailable. */}
        </div>
      </section>
    </div>
  );
}
