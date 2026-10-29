import type { Locale } from "./config";

export interface TranslationDictionary {
  locale: Locale;
  localeName: string;
  nav: {
    home: string;
    services: string;
    ourWork: string;
    aboutUs: string;
    contact: string;
    cta: string;
    language: string;
    selectLanguage: string;
    toggleMenu: string;
    switchToLight: string;
    switchToDark: string;
  };
  home: {
    hero: {
      eyebrow: string;
      titlePart1: string;
      titleEmphasis: string;
      titlePart2: string;
      tagline: string;
      intro: string;
      discussProject: string;
      exploreWork: string;
      growthSystem: string;
    };
    services: {
      eyebrow: string;
      titlePart1: string;
      titleEmphasis: string;
      subheading: string;
      cards: Array<{
        number: string;
        title: string;
        scene: string;
        description: string;
      }>;
      transition: string;
      knowMore: string;
      ariaServices: string;
      prevService: string;
      nextService: string;
      chooseService: string;
      carouselControls: string;
    };
    whyUs: {
      eyebrow: string;
      titlePart1: string;
      titleEmphasis: string;
      text: string;
    };
    whatWeDo: {
      eyebrow: string;
      titlePart1: string;
      titleEmphasis: string;
      subheading: string;
      items: Array<{
        title: string;
        description: string;
        alt: string;
      }>;
      exploreLabel: string;
      ctaTitle: string;
      ctaText: string;
    };
    tech: {
      eyebrow: string;
      titlePart1: string;
      titleEmphasis: string;
      paragraphs: string[];
      items: Array<{
        title: string;
        description: string;
      }>;
      cta: string;
    };
    why: {
      eyebrow: string;
      titlePart1: string;
      titleEmphasis: string;
      intro: string;
      pointsHeading: string;
      points: Array<{
        title: string;
        description: string;
      }>;
      /* Closing line, one short phrase per item */
      closing: string[];
    };
    process: {
      eyebrow: string;
      titlePart1: string;
      titleEmphasis: string;
      intro: string;
      steps: Array<{
        title: string;
        description: string;
      }>;
    };
    finalCta: {
      title: string;
      text: string;
      button: string;
    };
    work: {
      eyebrow: string;
      titlePart1: string;
      titleEmphasis: string;
      subheading: string;
      challengeLabel: string;
      outcomeLabel: string;
      ariaRegion: string;
      chooseProject: string;
      selectProject: string;
      showProject: string;
      previousProject: string;
      nextProject: string;
      projectAnnouncement: string;
      projects: Array<{
        slug: string;
        client: string;
        category: string;
        challenge: string;
        approach: string;
        outcome: string[];
        alt: string;
      }>;
    };
  };
  about: {
    header: {
      eyebrow: string;
      title: string;
      description: string;
      secondaryCta: string;
    };
    story: {
      eyebrow: string;
      paragraphs: string[];
    };
    purpose: {
      missionLabel: string;
      mission: string;
      beliefLabel: string;
      belief: string;
      /* Philosophy heading and paragraph shown under the mission & belief cards */
      philosophyLabel: string;
      philosophyTitle: string;
      approach: string;
    };
    approach: {
      eyebrow: string;
      /* Headings may mark their sage serif-italic accent with *…* (see accentTitle) */
      title: string;
      paragraphs: string[];
      steps: Array<{
        title: string;
        description: string;
      }>;
    };
    engagement: {
      eyebrow: string;
      title: string;
      description: string;
      options: Array<{
        title: string;
        description: string;
      }>;
    };
    cta: {
      title: string;
      paragraphs: string[];
      button: string;
    };
  };
  servicesPage: {
    /* Page H1; text between *…* renders as the sage serif-italic accent */
    heading: string;
    /* Italic pull quote under the H1 */
    quote: string;
    /* Approach statement between the intro paragraph and the service jump links */
    approach: string;
    /* Hero paragraph under the pull quote */
    intro: string;
    jumpLabel: string;
    helpLabel: string;
    outcomeLabel: string;
    fitLabel: string;
    /* Capability cards (moved from the About page), rendered by ServiceGrid */
    capabilities: {
      eyebrow: string;
      titlePart1: string;
      titleItalic: string;
      deliverablesBadge: string;
      startProject: string;
      lead: string;
      paragraphs: string[];
      capabilitiesLabel: string;
      outcomeLabel: string;
      services: Array<{
        title: string;
        description: string;
        deliverables: string[];
        tagline?: string;
        outcome?: string;
      }>;
    };
    items: Array<{
      label: string;
      title: string;
      /* Paragraphs separated by a blank line */
      intro: string;
      help: string[];
      outcome?: string;
      fit?: string;
      cta: string;
    }>;
  };
  contact: {
    header: {
      eyebrow: string;
      /* *…* marks the sage serif-italic accent (see accentTitle) */
      title: string;
      description: string;
    };
    sidebar: {
      intro: string;
      stepsLabel: string;
      steps: [string, string, string];
      tagline: string;
    };
    form: {
      stepTitles: [string, string, string, string];
      stepAria: string;
      stepPrefix: string;
      optionalTag: string;
      optionalNote: string;
      selectPlaceholder: string;
      /* options: localized labels keyed by the canonical stored values in lib/application-options.ts */
      fields: {
        contactName: { label: string; placeholder: string };
        workEmail: { label: string; placeholder: string; hint: string; error: string };
        companyName: { label: string; placeholder: string };
        helpWith: { label: string; legend: string; options: Record<string, string> };
        projectDetails: { label: string; placeholder: string; hint: string };
        companySize: { label: string; options: Record<string, string> };
        industry: { label: string; options: Record<string, string> };
        budget: { label: string; options: Record<string, string> };
        timeline: { label: string; options: Record<string, string> };
      };
      validationError: string;
      serverError: string;
      back: string;
      continue: string;
      submit: string;
      submitting: string;
    };
  };
  applicationReceived: {
    eyebrow: string;
    headlinePart1: string;
    headlineEmphasis: string;
    body1: string;
    body2: string;
    tagline: string;
    returnHome: string;
  };
  workUnavailable: {
    title: string;
    description: string;
    returnHome: string;
  };
  workPage: {
    eyebrow: string;
    title: string;
    attribution: string;
    sourceLink: string;
    filterLabel: string;
    allCategories: string;
    searchLabel: string;
    searchPlaceholder: string;
    viewLabel: string;
    grid: string;
    list: string;
    previewLabel: string;
    mediaPending: string;
    exploreProject: string;
    readDetails: string;
    noResults: string;
    clearFilters: string;
    closeDetails: string;
    sourceDetails: string;
    projects: Record<string, { category: string; displayTag: string; description: string }>;
  };
  footer: {
    ctaEyebrow: string;
    ctaHeading1: string;
    ctaHeading2: string;
    brandTagline: string;
    navHeading: string;
    connectHeading: string;
    officeHeading: string;
    location: string;
    localTimePrefix: string;
    copyright: string;
    slogan: string;
  };
  seo: {
    home: { title: string; description: string };
    about: { title: string; description: string };
    services: { title: string; description: string };
    contact: { title: string; description: string };
    work: { title: string; description: string };
    applicationReceived: { title: string; description: string };
  };
}
