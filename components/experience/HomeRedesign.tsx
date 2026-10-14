import Link from "next/link";
import { experienceConfig } from "@/lib/experience";

const ink = "#0B1B2B";
const pillars = [
  {
    number: "01", title: "Attention Engineering", scene: "Make them look.",
    description: "Data-backed, high-production visual assets built to capture and retain modern consumer attention spans.",
    media: "none",
  },
  {
    number: "02", title: "Performance Architecture", scene: "Make it perform.",
    description: "Algorithmic media buying stacks optimized for predictable corporate revenue multiplication.",
    media: "none",
  },
  {
    number: "03", title: "Autonomous Lifecycle Loops", scene: "Make it last.",
    description: "AI-powered CRM setups and custom data tracking systems that automate consumer retention.",
    media: "type",
  },
];

const projects = [
  {
    slug: "idfc-first-bank", client: "IDFC FIRST Bank: Emerging Banker Program", category: "Corporate film / recruitment branding",
    challenge: "Attract financial talent across India through a recruitment and branding showcase.",
    approach: "Cinematic storytelling around career acceleration, employee culture, and financial leadership, supported by multi-channel video assets and landing-page media.",
    image: experienceConfig.portfolio[0].image,
  },
  {
    slug: "quberx-brand-identity", client: "Quberx: Brand Identity", category: "Brand identity",
    challenge: "Develop a modern brand system and asset library to position Quberx as a technology innovator.",
    approach: "Custom visual identity guidelines, digital interface concepts, and marketing creative.",
    image: experienceConfig.portfolio[1].image,
  },
  {
    slug: "adhyaksh-film-shoot", client: "Adhyaksh: Bhairava Films", category: "Film announcement campaign",
    challenge: "Produce an official announcement shoot with promotional posters and social creative.",
    approach: "Creative direction, set design, portrait photography, promotional assets, and digital rollout.",
    image: experienceConfig.portfolio[2].image,
  },
  {
    slug: "anthem-launch", client: "Anthem Launch: Danny Pandit & Brahmaa", category: "Music promotion / social campaign",
    challenge: "Build momentum and audience traction for an official anthem launch.",
    approach: "Social hooks, creative teasers, and multi-format promotional campaigns across Instagram and YouTube.",
    image: experienceConfig.portfolio[3].image,
  },
];

export function HomeRedesign() {
  return (
    <div className="home-redesign" style={{ background: ink, color: "#F8F6F0" }}>
      <section className="home-hero" data-section-theme="dark" aria-labelledby="home-title">
        <div className="home-shell home-hero-inner">
          <p className="home-eyebrow"><span /> Intellect. Media. Capital.</p>
          <h1 id="home-title">We Engineer Digital Monopolies for Enterprise <em>Brands.</em></h1>
          <p className="home-intro">A closed-loop growth laboratory combining deep data analytics, high-retention media engineering, and AI-driven lifecycle automation.</p>
          <div className="home-actions">
            <Link className="home-button home-button-primary" href="/contact">Apply for Strategy Allocation <span aria-hidden="true">↗</span></Link>
            <a className="home-button home-button-secondary" href="#selected-work">Explore Selected Work</a>
          </div>
          <span className="home-index">01 / 03 <i /> The growth system</span>
        </div>
      </section>

      <section id="capabilities" className="home-pillars" data-section-theme="dark" aria-labelledby="pillars-title">
        <div className="home-shell">
          <div className="home-section-head">
            <p className="home-eyebrow">One connected growth system</p>
            <h2 id="pillars-title">Attention becomes <em>momentum.</em></h2>
            <p>Production, distribution, and retention work as one continuous engine.</p>
          </div>
          <div className="pillar-list">
            {pillars.map((pillar) => (
                <article className={`pillar-scene${pillar.media === "none" ? " pillar-scene--text" : ""}`} key={pillar.number}>
                <div className="pillar-copy">
                  <p className="home-eyebrow"><span /> {pillar.number} / {pillar.title}</p>
                  <h3>{pillar.scene}</h3>
                  <p>{pillar.description}</p>
                </div>
                {pillar.media === "type" && (
                  <div className="pillar-typography" aria-label="Recognize, return, retain">
                    <span>Recognize</span><span>Return</span><span>Retain</span>
                  </div>
                )}
              </article>
            ))}
          </div>
          <p className="home-transition"><span /> From attention to lasting value</p>
        </div>
      </section>

      <section id="selected-work" className="home-work" data-section-theme="dark" aria-labelledby="work-title">
        <div className="home-shell">
          <div className="work-heading">
            <div><p className="home-eyebrow">Selected work</p><h2 id="work-title">Built in the <em>real world.</em></h2></div>
            <p>Creative direction and media systems shaped around each project’s ambition.</p>
          </div>
          <div className="work-list">
            {projects.map((project, index) => (
              <article className={`work-feature work-feature-${index + 1}`} key={project.slug}>
                <figure className="work-image"><img src={project.image} alt={`${project.client} campaign`} loading="lazy" /></figure>
                <div className="work-copy">
                  <p className="home-eyebrow">{String(index + 1).padStart(2, "0")} / {project.category}</p>
                  <h3>{project.client}</h3>
                  <p><strong>Challenge</strong>{project.challenge}</p>
                  <p><strong>Execution</strong>{project.approach}</p>
                </div>
              </article>
            ))}
          </div>
          <Link href="/work" className="home-all-work">Explore all work <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  );
}
