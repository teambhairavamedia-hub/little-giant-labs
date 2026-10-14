# Graph Report - BhairavaMedia  (2026-07-02)

## Corpus Check
- 44 files · ~18,716 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 208 nodes · 298 edges · 19 communities (12 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b0e1ae09`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Home Experience & Counters|Home Experience & Counters]]
- [[_COMMUNITY_Intro Animations & Forms|Intro Animations & Forms]]
- [[_COMMUNITY_Dependencies & Packages|Dependencies & Packages]]
- [[_COMMUNITY_Page Layout & Header Components|Page Layout & Header Components]]
- [[_COMMUNITY_Global Styles & Themes|Global Styles & Themes]]
- [[_COMMUNITY_TSConfig settings|TSConfig settings]]
- [[_COMMUNITY_Video Carousel Component|Video Carousel Component]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Floating Navigation|Floating Navigation]]
- [[_COMMUNITY_UI Section Headings|UI Section Headings]]
- [[_COMMUNITY_Root App Templates|Root App Templates]]
- [[_COMMUNITY_ESLint Configuration|ESLint Configuration]]
- [[_COMMUNITY_NextJS Configuration|NextJS Configuration]]
- [[_COMMUNITY_PostCSS Settings|PostCSS Settings]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `cn()` - 11 edges
3. `Section()` - 9 edges
4. `Container()` - 6 edges
5. `Card()` - 6 edges
6. `siteConfig` - 6 edges
7. `hasIntroPlayed()` - 5 edges
8. `scripts` - 5 edges
9. `LandingCascade()` - 4 edges
10. `PageHeader()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Template()` --calls--> `hasIntroPlayed()`  [EXTRACTED]
  app/template.tsx → lib/intro.ts
- `LandingCascade()` --calls--> `cn()`  [EXTRACTED]
  components/experience/LandingCascade.tsx → lib/utils.ts
- `Section()` --calls--> `cn()`  [EXTRACTED]
  components/ui/Section.tsx → lib/utils.ts
- `Header()` --calls--> `useHeaderTheme()`  [EXTRACTED]
  components/layout/Header.tsx → hooks/useHeaderTheme.ts
- `Button()` --calls--> `cn()`  [EXTRACTED]
  components/ui/Button.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (19 total, 7 thin omitted)

### Community 0 - "Home Experience & Counters"
Cohesion: 0.08
Nodes (24): AnimatedCounter(), HomeExperience(), AboutSnap(), allTestimonials, brands, chapters, CinematicHero(), CinematicHeroProps (+16 more)

### Community 1 - "Intro Animations & Forms"
Cohesion: 0.15
Nodes (15): budgetRanges, ContactForm(), serviceOptions, cn(), BaseProps, Button(), ButtonAsButton, ButtonAsLink (+7 more)

### Community 2 - "Dependencies & Packages"
Cohesion: 0.08
Nodes (24): dependencies, framer-motion, gsap, lenis, next, react, react-dom, devDependencies (+16 more)

### Community 3 - "Page Layout & Header Components"
Cohesion: 0.14
Nodes (15): contactMethods, faqs, Container(), ContainerProps, CTABanner(), CTABannerProps, PageHeader(), PageHeaderProps (+7 more)

### Community 4 - "Global Styles & Themes"
Cohesion: 0.16
Nodes (12): dmSans, metadata, syne, useHeaderTheme(), Footer(), Header(), caseStudies, clientLogos (+4 more)

### Community 5 - "TSConfig settings"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 6 - "Video Carousel Component"
Cohesion: 0.17
Nodes (3): defaultTransition, VideoCarouselItem, VideoCarouselProps

### Community 7 - "Community 7"
Cohesion: 0.20
Nodes (5): milestones, values, services, ServiceGrid(), servicesDetails

### Community 8 - "Floating Navigation"
Cohesion: 0.33
Nodes (3): defaultTransition, FloatingPillNavigationProps, NavItem

### Community 10 - "Root App Templates"
Cohesion: 0.24
Nodes (9): Template(), getMultiplier(), heroImages, imagesConfig, LandingCascade(), LandingCascadeProps, dispatchIntroComplete(), hasIntroPlayed() (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **95 isolated node(s):** `milestones`, `values`, `contactMethods`, `faqs`, `syne` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Section()` connect `Page Layout & Header Components` to `Home Experience & Counters`, `Intro Animations & Forms`, `Global Styles & Themes`, `Community 7`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `cn()` connect `Intro Animations & Forms` to `Root App Templates`, `Page Layout & Header Components`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `siteConfig` connect `Global Styles & Themes` to `Root App Templates`, `Page Layout & Header Components`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `milestones`, `values`, `contactMethods` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Home Experience & Counters` be split into smaller, more focused modules?**
  _Cohesion score 0.08095238095238096 - nodes in this community are weakly interconnected._
- **Should `Intro Animations & Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.14736842105263157 - nodes in this community are weakly interconnected._
- **Should `Dependencies & Packages` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._