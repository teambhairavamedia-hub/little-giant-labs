import type { TranslationDictionary } from "../types";

export const en: TranslationDictionary = {
  locale: "en",
  localeName: "English",
  nav: {
    home: "Home",
    services: "Services",
    ourWork: "Our Work",
    aboutUs: "About Us",
    contact: "Contact",
    cta: "Book a Consultation",
    language: "Language",
    selectLanguage: "Select language",
    toggleMenu: "Toggle menu",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
  },
  home: {
    hero: {
      eyebrow: "Brand Strategy · Creative · Digital Growth",
      titlePart1: "Make your brand ",
      titleEmphasis: "matter",
      titlePart2: "",
      tagline: "Strategy that shapes it. Creativity that brings it to life. Digital that moves it forward.",
      intro:
        "We help startups, growing businesses and established enterprises turn their value into clear positioning, compelling communication and meaningful audience connections.",
      discussProject: "Discuss Your Business Challenge",
      exploreWork: "Explore Our Work",
      growthSystem: "The growth system",
    },
    services: {
      eyebrow: "One connected growth system",
      titlePart1: "Attention becomes ",
      titleEmphasis: "momentum",
      subheading: "Production, distribution, and retention work as one continuous engine.",
      cards: [
        {
          number: "01",
          title: "Attention Engineering",
          scene: "Make them look",
          description:
            "Data-backed, high-production visual assets built to capture and retain modern consumer attention spans.",
        },
        {
          number: "02",
          title: "Performance Architecture",
          scene: "Make it perform",
          description:
            "Algorithmic media buying stacks optimized for predictable corporate revenue multiplication.",
        },
        {
          number: "03",
          title: "Lifecycle Loops",
          scene: "Make it last",
          description:
            "AI-powered CRM setups and custom data tracking systems that automate consumer retention.",
        },
      ],
      transition: "From attention to lasting value",
      knowMore: "Want to Know More",
      ariaServices: "Our services",
      prevService: "Previous service",
      nextService: "Next service",
      chooseService: "Choose a service",
      carouselControls: "Service carousel controls",
    },
    whatWeDo: {
      eyebrow: "What we do",
      titlePart1: "Build the brand. Tell the story. ",
      titleEmphasis: "Create momentum.",
      subheading: "We bring strategy, creative and digital execution together to help businesses communicate with clarity, stand out in their markets and build stronger connections with their audiences.",
      items: [
        {
          title: "Brand Strategy & Positioning",
          description: "Define what makes your business different, who it serves and why people should choose it.",
          alt: "Hand pinning notes to a brand strategy planning board",
        },
        {
          title: "Creative & Content Studio",
          description: "Turn your strategy into compelling stories and creative assets that make your brand recognisable and relevant.",
          alt: "Colour swatches and design palettes on a creative studio desk",
        },
        {
          title: "Digital Marketing & Growth",
          description: "Reach the right audiences through purposeful digital campaigns, content and channel activation.",
          alt: "Laptop showing a digital marketing analytics dashboard",
        },
        {
          title: "Employer Brand & Talent Communication",
          description: "Help organisations express their culture, communicate their employee value proposition and connect with the people they need.",
          alt: "Colleagues celebrating together in a bright office",
        },
      ],
      exploreLabel: "Explore service",
      ctaTitle: "Have a specific business challenge?",
      ctaText: "Let's identify the right combination of strategy, creative and execution for your needs.",
    },
    why: {
      eyebrow: "Why Little Giant Labs",
      titlePart1: "Strategy first. Creative by design. ",
      titleEmphasis: "Execution with purpose.",
      intro: "We believe the strongest brand and marketing work begins with understanding the business—not choosing a channel, producing content or launching a campaign before the problem is clear.",
      points: [
        {
          title: "We start with the business challenge.",
          description: "We align brand communication with business goals, audience needs and market realities.",
        },
        {
          title: "We connect strategy with execution.",
          description: "Positioning, storytelling, creative and digital activation work together instead of operating as disconnected activities.",
        },
        {
          title: "We adapt to the challenge.",
          description: "From an early-stage brand to an established enterprise, we shape the engagement around the problem, audience and desired outcome.",
        },
        {
          title: "We look beyond the deliverable.",
          description: "We define what success should look like and use relevant evidence to assess the work.",
        },
      ],
    },
    process: {
      eyebrow: "A simple, repeatable process",
      titlePart1: "From business challenge to ",
      titleEmphasis: "meaningful impact.",
      intro: "A clear process keeps the work focused, collaborative and connected to the outcome.",
      steps: [
        {
          title: "Understand",
          description: "Clarify your business objectives, audience, challenges and definition of success.",
        },
        {
          title: "Position",
          description: "Define the strategic direction, core message and approach that will make the work relevant.",
        },
        {
          title: "Create",
          description: "Develop the concepts, stories, content and creative assets needed to bring the strategy to life.",
        },
        {
          title: "Activate & Learn",
          description: "Launch the work across relevant channels, review performance and identify opportunities to improve.",
        },
      ],
    },
    finalCta: {
      title: "Have a business challenge worth solving?",
      text: "Whether you're building a new brand, sharpening your market position or planning your next campaign, let's start with what you want to achieve.",
      button: "Let's Talk About Your Project",
    },
    work: {
      eyebrow: "Selected work",
      titlePart1: "Ideas are only the beginning. ",
      titleEmphasis: "Impact is the point.",
      subheading: "Explore how we bring business challenges, strategic thinking and creative execution together to create work that connects with people.",
      challengeLabel: "Challenge",
      outcomeLabel: "Outcome",
      ariaRegion: "Selected work projects",
      chooseProject: "Choose a project",
      selectProject: "Select project {current} of {count}",
      showProject: "Show project {current} of {count}",
      previousProject: "Previous project",
      nextProject: "Next project",
      projectAnnouncement: "Project {current} of {count}",
      projects: [
        {
          slug: "idfc-first-bank",
          client: "IDFC FIRST Bank: Emerging Banker Program",
          category: "Corporate film / recruitment branding",
          challenge: "Attract financial talent across India through a recruitment and branding showcase.",
          approach:
            "Cinematic storytelling around career acceleration, employee culture, and financial leadership, supported by multi-channel video assets and landing-page media.",
          outcome: [
            "Over 180,000 completed applicant views",
            "34% drop in paid talent acquisition costs",
            "Multi-city digital rollout across LinkedIn & YouTube",
          ],
          alt: "IDFC FIRST Bank logo with the tagline “Always You First” on a red background",
        },
        {
          slug: "quberx-brand-identity",
          client: "Quberx: Brand Identity",
          category: "Brand identity",
          challenge: "Develop a modern brand system and asset library to position Quberx as a technology innovator.",
          approach: "Custom visual identity guidelines, digital interface concepts, and marketing creative.",
          outcome: [
            "Complete visual guidelines & brand book",
            "Design system adopted across web & social media",
            "12 bespoke digital assets for product launch",
          ],
          alt: "Quberx social creative reading “Be prepared for every move.” beside glossy blue Bitcoin coins",
        },
        {
          slug: "adhyaksh-film-shoot",
          client: "Adhyaksh: Bhairava Films",
          category: "Film announcement campaign",
          challenge: "Produce an official announcement shoot with promotional posters and social creative.",
          approach: "Creative direction, set design, portrait photography, promotional assets, and digital rollout.",
          outcome: [
            "High-engagement announcement launch across Instagram",
            "Over 2.4 million organic impressions in 72 hours",
            "Official theatrical posters and social cutdowns",
          ],
          alt: "Adhyaksh film poster by Bhairava Films: the lead in a beige jacket and sunglasses with his crew, under the red Devanagari title",
        },
        {
          slug: "anthem-launch",
          client: "Anthem Launch: Danny Pandit & Brahmaa",
          category: "Music promotion / social campaign",
          challenge: "Build momentum and audience traction for an official anthem launch.",
          approach: "Social hooks, creative teasers, and multi-format promotional campaigns across Instagram and YouTube.",
          outcome: [
            "Over 12M combined views across reels and shorts",
            "45,000+ organic audio usages in 14 days",
            "Top-charting viral track across regional platforms",
          ],
          alt: "“Zat Pat Pata Pat” song poster: Danny Pandit in an orange jacket and glowing sunglasses before a bright mandala, releasing 28 November",
        },
      ],
    },
  },
  about: {
    header: {
      eyebrow: "About Little Giant Labs",
      title: "We build digital movements",
      description: "We turn business value into brands people understand, remember and choose.",
      secondaryCta: "Explore our services",
    },
    story: {
      eyebrow: "Our story",
      paragraphs: [
        "Little Giant Labs is a strategic brand, creative and digital growth studio that helps businesses translate what they do into why it matters.",
        "We work at the intersection of business understanding, brand strategy, storytelling and technology—helping companies articulate their value, differentiate their offerings and connect with the audiences that matter.",
        "From defining a product's narrative to creating compelling campaigns and taking them to market, we bring strategy and execution together to build communication with purpose.",
        "Our multidisciplinary perspective combines business, technology and creative thinking, allowing us to look beyond the deliverable and focus on the business challenge behind it.",
      ],
    },
    purpose: {
      missionLabel: "Our mission",
      mission: "To help businesses clarify their value, build distinctive brands and turn meaningful stories into market impact.",
      beliefLabel: "What we believe",
      belief: "The best brand communication doesn't just get noticed. It makes people understand, connect and remember.",
    },


    capabilities: {
      eyebrow: "Services",
      titlePart1: "Services",
      titleItalic: "",
      deliverablesBadge: "Deliverables",
      startProject: "Start Project",
      lead: "Strategy meets creativity. Creativity drives connection.",
      paragraphs: [
        "Every business has a story worth telling. The challenge is making that story clear, compelling and relevant to the people who matter.",
        "At Little Giant Labs, we bring together brand strategy, creative communication, content production and digital marketing to help businesses express their value, strengthen their presence and build meaningful connections with their audiences.",
        "From defining your brand story to bringing it to life across digital and visual channels, we turn ideas into communication that makes an impact.",
      ],
      capabilitiesLabel: "Our capabilities include",
      outcomeLabel: "The outcome:",
      services: [
        {
          title: "Brand Strategy & Positioning",
          description: "We help businesses define what makes them distinctive, articulate the value they create and develop a brand narrative that resonates with the audiences that matter.",
          deliverables: [
            "Brand positioning and differentiation",
            "Value proposition and messaging",
            "Corporate and product narratives",
            "Campaign strategy and creative direction",
          ],
        },
        {
          title: "Creative & Content Studio",
          description: "We turn brand strategy into compelling creative expression—from visual identities and campaign concepts to films, digital content and motion-led storytelling. Every format is chosen to serve the message, audience and intended outcome.",
          deliverables: [
            "Visual identity and marketing collateral",
            "Campaign concepts and creative assets",
            "Corporate films, video and podcasts",
            "Short-form video, motion graphics and animation",
            "AI-assisted creative exploration and production",
          ],
        },
        {
          title: "Digital Marketing & Growth",
          description: "We help brands reach the right audiences through purposeful digital campaigns, relevant content and continuous optimisation. Our focus is on aligning audience engagement and campaign performance with clear business objectives.",
          deliverables: [
            "Digital and social media strategy",
            "Content planning and channel activation",
            "Paid media and campaign creative",
            "Audience targeting and campaign optimisation",
            "Performance measurement and reporting",
          ],
        },
        {
          title: "Employer Brand & Talent Communication",
          description: "We help organisations communicate their culture, people and employee proposition through authentic stories and purposeful recruitment communication—making it easier for prospective talent to understand what makes the organisation distinctive.",
          deliverables: [
            "Employer brand positioning and communication",
            "Workplace and culture storytelling",
            "Recruitment campaigns and creative",
            "Employee stories and talent communication",
          ],
        },
      ],
    },
    approach: {
      eyebrow: "How we work",
      title: "From business challenge to *purposeful execution.*",
      paragraphs: [
        "Every engagement starts with understanding what you need to achieve. We then shape the strategy, develop the creative and activate the work in a way that fits your goals.",
      ],
      steps: [
        {
          title: "Understand",
          description: "We learn about your business, audience, objectives and current challenges.",
        },
        {
          title: "Position",
          description: "We establish the strategic direction, core message and approach.",
        },
        {
          title: "Create",
          description: "We develop the creative, content and campaign assets needed to bring the strategy to life.",
        },
        {
          title: "Activate & Learn",
          description: "We put the work into action, review the relevant results and identify opportunities to improve.",
        },
      ],
    },
    engagement: {
      eyebrow: "Engagement options",
      title: "The right expertise for *the stage you're at.*",
      description: "Whether you need strategic clarity, creative execution or support for a larger campaign, we shape our engagement around your objectives and requirements.",
      options: [
        {
          title: "For startups and emerging brands",
          description: "Establish your positioning, clarify your story and build the foundations for consistent brand communication.",
        },
        {
          title: "For growing businesses",
          description: "Strengthen your market differentiation, align your marketing activity and create a more coherent customer-facing brand.",
        },
        {
          title: "For established enterprises",
          description: "Support defined brand, campaign or communication initiatives with a focused strategy and coordinated execution.",
        },
      ],
    },
    cta: {
      title: "Let’s solve *the right problem first.*",
      paragraphs: [
        "Tell us what you’re trying to achieve. We’ll start with your business challenge and explore where strategy, creative and digital execution can make a difference.",
      ],
      button: "Discuss Your Business Challenge",
    },
  },
  servicesPage: {
    heading: "Good marketing starts with a *clear business strategy.*",
    jumpLabel: "Jump to a service",
    helpLabel: "What we can help with",
    outcomeLabel: "The outcome",
    fitLabel: "A good fit if…",
    items: [
      {
        label: "Brand Strategy",
        title: "Know what makes you different—and *make it matter.*",
        intro: "When a business cannot clearly articulate its value, even great products and services can struggle to stand out. We help you define your positioning, sharpen your story and create a foundation for consistent brand communication.",
        help: [
          "Brand discovery and strategic assessment",
          "Market and competitor positioning",
          "Audience and customer insight, where supported by research",
          "Value proposition and brand messaging",
          "Brand architecture and portfolio clarity",
          "Brand narrative and communication direction",
        ],
        outcome: "A clearer brand direction, stronger messaging and a shared understanding of how your business should be positioned and communicated.",
        fit: "You are launching a business, entering a new market, evolving your brand or struggling to explain why customers should choose you.",
        cta: "Discuss Your Brand Strategy",
      },
      {
        label: "Creative & Content",
        title: "Make your brand recognisable, *relevant and memorable.*",
        intro: "A strong strategy needs an equally strong expression. We turn brand direction into creative ideas, content and communication that help your business show up consistently across the places your audience encounters it.",
        help: [
          "Creative concept development and art direction",
          "Brand identity and visual communication",
          "Campaign concepts and creative assets",
          "Website and marketing copy",
          "Content planning and brand storytelling",
          "Digital and social creative production",
        ],
        outcome: "A more coherent brand experience, more distinctive communication and creative assets built around a clear message.",
        fit: "Your brand looks inconsistent, your message lacks distinction or your campaigns need a clearer creative idea.",
        cta: "Discuss a Creative Project",
      },
      {
        label: "Digital Growth",
        title: "Turn your strategy into *meaningful audience engagement.*",
        intro: "Digital marketing works best when the audience, message, channel and business objective are aligned. We help translate your strategy into focused digital activity and use relevant performance signals to inform what happens next.",
        help: [
          "Digital campaign strategy and planning",
          "Social media and content activation",
          "Paid media planning and campaign management, where offered",
          "Website and landing-page messaging optimisation",
          "Audience engagement and content distribution",
          "Campaign reporting and performance review",
        ],
        outcome: "More focused campaigns, better alignment between message and audience, and clearer insight into what is working and where to improve.",
        fit: "Your digital activity lacks a coherent strategy, campaigns are disconnected or you need a clearer way to evaluate marketing effectiveness.",
        cta: "Discuss Your Digital Strategy",
      },
      {
        label: "Employer Brand",
        title: "Help the right people see *why they should work with you.*",
        intro: "The way an organisation communicates its culture and opportunities influences how prospective employees perceive it. We help businesses articulate their employer story and translate it into recruitment and talent communication.",
        help: [
          "Employer brand positioning and messaging",
          "Employee value proposition communication",
          "Recruitment campaign concepts and creative",
          "Talent-focused digital content",
          "Careers-page and recruitment communication content",
          "Campaign reporting, where measurement is included",
        ],
        outcome: "A clearer employer narrative and more consistent communication with the people your organisation wants to attract.",
        fit: "You are scaling your team, launching a recruitment campaign or need to communicate your culture and employee proposition more effectively.",
        cta: "Discuss Employer Branding",
      },
    ],
  },
  contact: {
    header: {
      eyebrow: "Let's start a conversation",
      title: "Tell us *what you're trying to achieve.*",
      description: "Whether you're building a new brand, strengthening your market position or planning your next campaign, we'd like to understand your challenge.",
    },
    sidebar: {
      intro: "Share a little about your business and what you need help with. We'll use that context to explore whether Little Giant Labs is the right partner for your project.",
      stepsLabel: "What happens next",
      steps: [
        "Tell us about your business and objectives.",
        "We'll review your requirements.",
        "We'll connect to discuss the most appropriate next steps.",
      ],
      tagline: "Brand Strategy · Creative · Digital Growth",
    },
    form: {
      stepTitles: [
        "About you",
        "Your project",
        "About your company",
        "Budget & timeline",
      ],
      stepAria: "Step {step} of 4",
      stepPrefix: "Step",
      optionalTag: "Optional",
      optionalNote: "Optional — share only what you're comfortable with.",
      selectPlaceholder: "Prefer not to say",
      fields: {
        contactName: {
          label: "Your name",
          placeholder: "First and last name",
        },
        workEmail: {
          label: "Work email",
          placeholder: "name@company.com",
          hint: "Use your work email. Personal addresses such as Gmail and Yahoo are not accepted.",
          error: "Enter a valid work email address.",
        },
        companyName: {
          label: "Company or brand name",
          placeholder: "Your company or brand",
        },
        helpWith: {
          label: "What do you need help with?",
          legend: "What you need help with",
          options: {
            "Brand strategy & positioning": "Brand strategy & positioning",
            "Creative & content": "Creative & content",
            "Digital marketing & growth": "Digital marketing & growth",
            "Employer brand & talent communication": "Employer brand & talent communication",
            "Not sure yet / help me decide": "Not sure yet / help me decide",
          },
        },
        projectDetails: {
          label: "Tell us a little about your project",
          placeholder: "What are you trying to achieve, and what's getting in the way?",
          hint: "Up to 2,000 characters.",
        },
        companySize: {
          label: "Company size",
          options: {
            "1–10 people": "1–10 people",
            "11–50 people": "11–50 people",
            "51–200 people": "51–200 people",
            "201–1,000 people": "201–1,000 people",
            "1,000+ people": "1,000+ people",
          },
        },
        industry: {
          label: "Industry",
          options: {
            "Technology & SaaS": "Technology & SaaS",
            "Financial services & fintech": "Financial services & fintech",
            "Consumer, retail & D2C": "Consumer, retail & D2C",
            "Media, entertainment & music": "Media, entertainment & music",
            "Real estate & infrastructure": "Real estate & infrastructure",
            "Professional & B2B services": "Professional & B2B services",
            "Healthcare & life sciences": "Healthcare & life sciences",
            "Education": "Education",
            "Other": "Other",
          },
        },
        budget: {
          label: "Budget range",
          options: {
            "Under $5,000": "Under $5,000",
            "$5,000 – $15,000": "$5,000 – $15,000",
            "$15,000 – $50,000": "$15,000 – $50,000",
            "$50,000+": "$50,000+",
            "Not sure yet": "Not sure yet",
          },
        },
        timeline: {
          label: "Desired timeline",
          options: {
            "As soon as possible": "As soon as possible",
            "Within 1–3 months": "Within 1–3 months",
            "Within 3–6 months": "Within 3–6 months",
            "Flexible / not decided": "Flexible / not decided",
          },
        },
      },
      validationError: "Complete the required fields to continue.",
      serverError: "We couldn’t submit your enquiry. Please try again later.",
      back: "← Back",
      continue: "Continue →",
      submit: "Submit Your Enquiry",
      submitting: "Submitting…",
    },
  },
  applicationReceived: {
    eyebrow: "Enquiry received",
    headlinePart1: "The next move ",
    headlineEmphasis: "is ours",
    body1: "Thanks for getting in touch. We've received your enquiry and will review your business, objectives and requirements.",
    body2: "We'll connect to discuss the most appropriate next steps.",
    tagline: "Little Giant Labs — Brand Strategy · Creative · Digital Growth",
    returnHome: "Return to the main website ↗",
  },
  workUnavailable: {
    title: "Work | Temporarily Unavailable",
    description: "The selected work section is temporarily unavailable.",
    returnHome: "Return to the main website ↗",
  },
  workPage: {
    eyebrow: "Selected projects",
    title: "Featured by Bhairava Media.",
    attribution: "These six projects and summaries are attributed to Bhairava Media’s public portfolio. Little Giant Labs’ role in these projects and authorization to present them as LGL work have not been confirmed. Images, video, and unverified performance claims are omitted.",
    sourceLink: "View Bhairava Media’s source portfolio",
    filterLabel: "Filter projects by category",
    allCategories: "All",
    searchLabel: "Search projects",
    searchPlaceholder: "Search projects",
    viewLabel: "Project view",
    grid: "Grid",
    list: "List",
    previewLabel: "Project preview",
    mediaPending: "Media pending authorization",
    exploreProject: "Explore project",
    readDetails: "Read project details",
    noResults: "No projects found",
    clearFilters: "Clear filters",
    closeDetails: "Close project details",
    sourceDetails: "View details on Bhairava Media",
    projects: {
      "idfc-first-bank": {
        category: "Brand Launch",
        displayTag: "Emerging Banker",
        description: "IDFC FIRST Bank needed a high-impact recruitment and branding showcase for its Emerging Banker Program to attract top financial talent from across India.",
      },
      "quberx-brand-identity": {
        category: "Creative Direction",
        displayTag: "Brand Identity",
        description: "Quberx needed a modern, minimalist brand system and asset library to position itself as a forward-thinking technology innovator.",
      },
      "adhyaksh-film-shoot": {
        category: "Brand Launch",
        displayTag: "",
        description: "Bhairava Films’ official announcement shoot for ‘Adhyaksh’ called for dynamic promotional posters and high-energy social creative.",
      },
      "danny-pandit-brahmaa": {
        category: "Social Content",
        displayTag: "",
        description: "The project aimed to build momentum and explosive viral traction for the official anthem launch featuring Danny Pandit and Brahmaa.",
      },
      "erik-vinmayi-96": {
        category: "Cinematic Film",
        displayTag: "",
        description: "A nostalgic, emotional visual campaign for the release of the ‘96’ music track.",
      },
      "commercial-adshoot-series": {
        category: "Performance Ads",
        displayTag: "",
        description: "A humorous, relatable commercial series designed to capture Gen-Z and millennial attention across social feeds.",
      },
    },
  },
  footer: {
    ctaEyebrow: "Start the Conversation",
    ctaHeading1: "Let's create",
    ctaHeading2: "something bold",
    brandTagline: "A strategy-led brand and creative partner connecting business thinking, compelling storytelling and digital execution.",
    navHeading: "Navigation",
    connectHeading: "Connect",
    officeHeading: "Office",
    location: "PUNE, IN",
    localTimePrefix: "Local Time:",
    copyright: "Little Giant Labs. All rights reserved.",
    slogan: "Brand Strategy · Creative · Digital Growth",
  },
  seo: {
    services: {
      title: "Little Giant Labs | Brand Strategy, Creative & Digital Marketing",
      description: "Explore Little Giant Labs' brand strategy, creative, digital marketing and employer branding services. We help businesses clarify their value and connect with the audiences that matter.",
    },
    home: {
      title: "Little Giant Labs",
      description:
        "A modern media and marketing laboratory dedicated to building powerful brand presence through innovative content, digital marketing, and AI-powered solutions.",
    },
    about: {
      title: "About Us",
      description:
        "Learn about our vision, leadership, and how Little Giant Labs scales enterprise brands through cinematic media and performance architecture.",
    },
    contact: {
      title: "Partnership Application",
      description:
        "Apply for an institutional growth partnership. Share your enterprise objectives, metrics, and strategic roadblocks.",
    },
    work: {
      title: "Selected Work",
      description: "Explore our portfolio of high-impact creative campaigns and performance growth systems.",
    },
    applicationReceived: {
      title: "Application Received",
      description: "Your application has been received. Our leadership team will review your submission.",
    },
  },
};
