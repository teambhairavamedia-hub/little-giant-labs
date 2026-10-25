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
  };
  home: {
    hero: {
      eyebrow: string;
      titlePart1: string;
      titleEmphasis: string;
      titlePart2: string;
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
      ariaServices: string;
      prevService: string;
      nextService: string;
      chooseService: string;
    };
    work: {
      eyebrow: string;
      titlePart1: string;
      titleEmphasis: string;
      subheading: string;
      challengeLabel: string;
      outcomeLabel: string;
      ariaRegion: string;
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
    };
    leadership: {
      eyebrow: string;
      pointOfView: string;
      titlePart1: string;
      titleItalic: string;
      intro: string;
      quote: string;
      quoteAuthor: string;
      visionTab: string;
      philosophyTab: string;
      tabs: {
        vision: { title: string; body: string };
        philosophy: { title: string; body: string };
      };
      founderRole: string;
      founderName: string;
      founderBio: string;
      founderAlt: string;
    };
    timeline: {
      eyebrow: string;
      titlePart1: string;
      titleItalic: string;
      milestones: Array<{
        year: string;
        title: string;
        desc: string;
      }>;
    };
    capabilities: {
      eyebrow: string;
      titlePart1: string;
      titleItalic: string;
      deliverablesBadge: string;
      startProject: string;
      services: Array<{
        title: string;
        description: string;
        deliverables: string[];
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
    contact: { title: string; description: string };
    work: { title: string; description: string };
    applicationReceived: { title: string; description: string };
  };
}
