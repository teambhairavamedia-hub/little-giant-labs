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
      ctaButton: string;
    };
    why: {
      eyebrow: string;
      titlePart1: string;
      titleEmphasis: string;
      intro: string;
      points: Array<{
        title: string;
        description: string;
      }>;
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
      factsLabel: string;
      facts: Array<{
        label: string;
        value: string;
      }>;
    };
    purpose: {
      missionLabel: string;
      mission: string;
      beliefLabel: string;
      belief: string;
    };
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
    principles: {
      eyebrow: string;
      titlePart1: string;
      titleItalic: string;
      values: Array<{
        title: string;
        description: string;
      }>;
    };
    approach: {
      eyebrow: string;
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
    jumpLabel: string;
    helpLabel: string;
    outcomeLabel: string;
    fitLabel: string;
    items: Array<{
      label: string;
      title: string;
      intro: string;
      help: string[];
      outcome: string;
      fit: string;
      cta: string;
    }>;
  };
  contact: {
    header: {
      eyebrow: string;
      tagline: string;
      titlePart1: string;
      titleEmphasis: string;
      description: string;
    };
    sidebar: {
      eyebrow: string;
      title: string;
      description: string;
      tagline: string;
    };
    form: {
      stepTitles: [string, string, string, string];
      stepAria: string;
      stepPrefix: string;
      fields: {
        enterpriseName: {
          label: string;
          placeholder: string;
        };
        industry: {
          label: string;
          legend: string;
          options: Record<string, string>;
        };
        revenue: {
          label: string;
          legend: string;
          options: Record<string, string>;
        };
        acquisitionSpend: {
          label: string;
          legend: string;
          options: Record<string, string>;
          financialNote: string;
        };
        bottleneck: {
          label: string;
          legend: string;
          options: Record<string, string>;
        };
        partnership: {
          label: string;
          legend: string;
          options: Record<string, string>;
        };
        corporateEmail: {
          instruction: string;
          label: string;
          placeholder: string;
          hint: string;
          error: string;
        };
        linkedin: {
          label: string;
          placeholder: string;
          error: string;
        };
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
