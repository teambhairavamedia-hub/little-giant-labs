import type { TranslationDictionary } from "../types";

export const de: TranslationDictionary = {
  locale: "de",
  localeName: "Deutsch",
  nav: {
    home: "Startseite",
    services: "Leistungen",
    ourWork: "Unsere Arbeiten",
    aboutUs: "Über uns",
    contact: "Kontakt",
    cta: "Beratungsgespräch buchen",
    language: "Sprache",
    selectLanguage: "Sprache wählen",
    toggleMenu: "Menü öffnen/schließen",
    switchToLight: "Helles Design aktivieren",
    switchToDark: "Dunkles Design aktivieren",
  },
  home: {
    hero: {
      eyebrow: "Intellekt. Medien. Kapital.",
      titlePart1: "Wir erschaffen digitale Monopole für führende ",
      titleEmphasis: "Marken",
      titlePart2: "",
      intro:
        "Ein ganzheitliches Wachstumslabor, das fundierte Datenanalyse, wirkungsstarke audiovisuelle Medien und KI-gestützte Lebenszyklus-Automatisierung vereint.",
      discussProject: "Projekt Besprechen",
      exploreWork: "Unsere Arbeiten Entdecken",
      growthSystem: "Das Wachstumssystem",
    },
    services: {
      eyebrow: "Ein geschlossenes Wachstumssystem",
      titlePart1: "Aufmerksamkeit wird zu ",
      titleEmphasis: "Dynamik",
      subheading: "Produktion, Distribution und Kundenbindung greifen als kontinuierlicher Motor ineinander.",
      cards: [
        {
          number: "01",
          title: "Aufmerksamkeits-Engineering",
          scene: "Blickfänge schaffen",
          description:
            "Datengestützte, hochkarätige visuelle Inhalte, entwickelt zur Gewinnung und dauerhaften Bindung moderner Konsumenten.",
        },
        {
          number: "02",
          title: "Performance-Architektur",
          scene: "Wirkung erzielen",
          description:
            "Algorithmische Media-Buying-Strategien, optimiert für planbares Umsatzwachstum.",
        },
        {
          number: "03",
          title: "Lifecycle-Schleifen",
          scene: "Nachhaltig binden",
          description:
            "KI-gestützte CRM-Systeme und maßgeschneidertes Datentracking, die Kundenbindung vollständig automatisieren.",
        },
      ],
      transition: "Von bloßer Aufmerksamkeit zu bleibendem Wert",
      ariaServices: "Unsere Leistungen",
      prevService: "Vorherige Leistung",
      nextService: "Nächste Leistung",
      chooseService: "Leistung auswählen",
      carouselControls: "Steuerung des Leistungskarussells",
    },
    work: {
      eyebrow: "Ausgewählte Arbeiten",
      titlePart1: "Entwickelt in der ",
      titleEmphasis: "realen Welt",
      subheading: "Kreativdirektion und Mediensysteme, präzise zugeschnitten auf die Ambitionen jedes Projekts.",
      challengeLabel: "Herausforderung",
      outcomeLabel: "Ergebnis",
      ariaRegion: "Ausgewählte Projekte",
      chooseProject: "Projekt auswählen",
      selectProject: "Projekt {current} von {count} auswählen",
      showProject: "Projekt {current} von {count} anzeigen",
      previousProject: "Vorheriges Projekt",
      nextProject: "Nächstes Projekt",
      projectAnnouncement: "Projekt {current} von {count}",
      projects: [
        {
          slug: "idfc-first-bank",
          client: "IDFC FIRST Bank: Emerging Banker Program",
          category: "Unternehmensfilm / Employer Branding",
          challenge: "Gewinnung herausragender Finanztalente in ganz Indien durch eine zielgerichtete Recruiting- und Markenkampagne.",
          approach:
            "Filmische Erzählkunst über Karriereförderung, Unternehmenskultur und Leadership, flankiert von plattformübergreifenden Video-Assets und Landingpages.",
          outcome: [
            "Über 180.000 vollständige Bewerber-Aufrufe",
            "34% Senkung der Talentakquisekosten",
            "Multimetropolen-Rollout auf LinkedIn und YouTube",
          ],
          alt: "Logo der IDFC FIRST Bank mit dem Claim „Always You First“ auf rotem Grund",
        },
        {
          slug: "quberx-brand-identity",
          client: "Quberx: Markenidentität",
          category: "Markenidentität",
          challenge: "Entwicklung eines modernen Markensystems zur klaren Positionierung von Quberx als technologischer Vorreiter.",
          approach: "Maßgeschneiderte Designrichtlinien, Benutzeroberflächen-Konzepte und wirkungsstarke Marketing-Creatives.",
          outcome: [
            "Vollständiges Brand Book und visuelle Leitlinien",
            "Einheitliches Designsystem über Web und Social Media",
            "12 exklusive digitale Assets für den Produktlaunch",
          ],
          alt: "Quberx Social Creative mit der Botschaft „Be prepared for every move.“ neben glänzenden blauen Bitcoin-Münzen",
        },
        {
          slug: "adhyaksh-film-shoot",
          client: "Adhyaksh: Bhairava Films",
          category: "Film-Ankündigungskampagne",
          challenge: "Produktion eines offiziellen Ankündigungsshootings inklusive Plakaten und wirkungsvollen Social-Creatives.",
          approach: "Kreativdirektion, Setdesign, Porträtfotografie, Werbemittel und digitaler Rollout.",
          outcome: [
            "Reichweitenstarker Kampagnenstart auf Instagram",
            "Über 2,4 Millionen organische Impressionen in 72 Stunden",
            "Offizielle Kinoplakate und plattformoptimierte Social Edits",
          ],
          alt: "Filmplakat zu Adhyaksh von Bhairava Films: Hauptdarsteller in beigefarbener Jacke mit Crew unter rotem Devanagari-Schriftzug",
        },
        {
          slug: "anthem-launch",
          client: "Hymnen-Release: Danny Pandit & Brahmaa",
          category: "Musikpromotion / Social-Kampagne",
          challenge: "Aufbau von maximalem Hype und Reichweite für die offizielle Hymnenveröffentlichung.",
          approach: "Fesselnde Social Hooks, kreative Teaser und crossmediale Kampagnen auf Instagram und YouTube.",
          outcome: [
            "Über 12 Millionen kumulierte Videoaufrufe auf Reels und Shorts",
            "Mehr als 45.000 organische Audioverwendungen in 14 Tagen",
            "Top-Chart-Platzierung und viraler Hit auf regionalen Plattformen",
          ],
          alt: "Songplakat zu „Zat Pat Pata Pat“: Danny Pandit in orangeroter Jacke vor leuchtendem Mandala",
        },
      ],
    },
  },
  about: {
    header: {
      eyebrow: "Über Little Giant Labs",
      title: "Wir schaffen digitale Bewegungen",
      description:
        "Little Giant Labs verbindet filmisches High-Retention-Storytelling mit Performance-Marketing – für Marken, die den Markt anführen wollen.",
    },
    leadership: {
      eyebrow: "Unsere Führung",
      pointOfView: "01 / DIE PERSPEKTIVE",
      titlePart1: "Storytelling ",
      titleItalic: "aus Überzeugung",
      intro:
        "Rajesh Waghchaware gründete Little Giant Labs auf einer klaren Erkenntnis: In einer digitalen Welt, die von austauschbaren Werbemitteln überschwemmt wird, erzeugen nur die am präzisesten kalkulierten, filmischen Kampagnen echte Aufmerksamkeit.",
      quote: "„Little Giant Labs steht für mutige Visionen und kompromisslose Umsetzung. Diesen Fokus übertragen wir direkt auf die Marken, die wir skalieren.“",
      quoteAuthor: "Rajesh Waghchaware",
      visionTab: "Vision",
      philosophyTab: "Philosophie",
      tabs: {
        vision: {
          title: "Digitale Bewegungen Formen",
          body: "Wir schaffen eine Welt, in der Markengeschichten keine gewöhnliche Werbung sind, sondern filmische Erlebnisse, die tiefes Vertrauen und eine loyale Gemeinschaft aufbauen. Aufmerksamkeit ist die wertvollste Währung unserer Zeit – und wir behandeln sie mit höchstem Respekt durch herausragende kreative Inhalte.",
        },
        philosophy: {
          title: "Performance ist der Beweis für Kreativität",
          body: "Werbung darf nicht nur gut aussehen; sie muss konvertieren. Indem wir die Brücke zwischen professionellen Kinokameras und hochpräzisen Analyse-Dashboards schlagen, verwandeln wir Reichweite in messbaren Unternehmenswert. Daten zeigen, was funktioniert – Kreativität erklärt, warum es berührt.",
        },
      },
      founderRole: "Gründer & Creative Director",
      founderName: "Rajesh Waghchaware",
      founderBio:
        "Verantwortlich für kreative Strategien, Wachstumsanalyse-Pipelines und filmische Produktionen für weltweit führende Wachstumsmarken.",
      founderAlt: "Rajesh Waghchaware, Gründer und Creative Director",
    },
    timeline: {
      eyebrow: "Unsere Entwicklung",
      titlePart1: "Evolution in",
      titleItalic: "Meilensteinen",
      milestones: [
        {
          year: "2021",
          title: "Die Gründung",
          desc: "Little Giant Labs wurde in Mumbai von Rajesh Waghchaware ins Leben gerufen – mit der Überzeugung, dass Video-Content cineastisch sein und echte Geschichten erzählen muss. Gestartet mit einer Kamera und einer klaren Vision.",
        },
        {
          year: "2023",
          title: "Kreativität Trifft Performance",
          desc: "Wir erkannten: Außergewöhnliche Kreativität muss harte Geschäftsergebnisse liefern. Integration von digitalen Ad-Operations, Datenanalysen und Funnels. Unser erster großer E-Commerce-Kunde erreichte einen ROAS von 5x.",
        },
        {
          year: "2024",
          title: "KI-Gestützte Systeme",
          desc: "Pioniere bei KI-basierten Postproduktions-Workflows und CRM-Automatisierungsschleifen. Wir unterstützen Kunden bei automatisierten Follow-ups und KI-Kundenbindung für vollkommen autonome Marketingprozesse.",
        },
        {
          year: "2026",
          title: "Globale Expansion",
          desc: "Erweiterung auf internationale Märkte. Heute betreut Little Giant Labs mehr als 10 globale Marken, generiert jährlich über 120 Millionen Aufrufe und gestaltet digitales Wachstum für Marktführer.",
        },
      ],
    },
    capabilities: {
      eyebrow: "Unsere Kompetenzen",
      titlePart1: "Wie wir Ihre Marke",
      titleItalic: "skalieren",
      deliverablesBadge: "Leistungsumfang",
      startProject: "Projekt Starten",
      services: [
        {
          title: "Markenstrategie & Design",
          description: "Positionierung, Tonalität und visuelle Identitätssysteme, die Autorität ausstrahlen und Markenpräsenz sichern.",
          deliverables: [
            "Auditierung von Wettbewerber-Funnels",
            "Visuelle Identität & Logo-Entwicklung",
            "Brand-Voice- und Strategie-Handbücher",
            "Hochwertige UX/UI-Designsysteme",
          ],
        },
        {
          title: "Cineastische Content-Produktion",
          description: "Premium-Markenfilme, Social Showreels und Werbemittel mit maximaler Zuschauerbindung.",
          deliverables: [
            "Kurzformat-Hook-Engineering",
            "Filmische Marken-Showreels",
            "Konzeption & Werbetexting",
            "High-Retention Schnitt & Sounddesign",
          ],
        },
        {
          title: "Performance- & Digital-Marketing",
          description: "Bezahlte Neukundengewinnung, Social Growth und Suchmaschinenpräsenz mit Fokus auf messbares Wachstum.",
          deliverables: [
            "Paid Ads (Meta, Google, YouTube)",
            "Funnel-Optimierung & CRO",
            "ROAS-gesteuerte Kampagnenführung",
            "Echtzeit-Attributions-Dashboards",
          ],
        },
        {
          title: "KI- & Automatisierungslösungen",
          description: "Maßgeschneiderte Workflow-Automatisierungen, KI-Analysetools und CRM-Systeme für maximale Skalierbarkeit.",
          deliverables: [
            "KI-gestützte Kunden-Workflows",
            "CRM- & E-Mail-Automationsschleifen",
            "Lead-Scoring-Analysesysteme",
            "Individuelle Business-Intelligence-Tools",
          ],
        },
      ],
    },
    principles: {
      eyebrow: "Unsere Grundsätze",
      titlePart1: "Geleitet von",
      titleItalic: "Überzeugung",
      values: [
        {
          title: "Story First",
          description:
            "Jeder Pixel, jedes Bild und jedes Wort entsteht mit klarer Absicht. In Zeiten endlosen Scrollens durchdringen nur mitreißende Hooks und authentisches Storytelling den Lärm.",
        },
        {
          title: "Datenbasierte Validierung",
          description:
            "Kreativität begeistert, aber Konversionen entscheiden. Wir analysieren Wachstums-Funnels, auditieren Metriken und steuern wissenschaftlich fundierte Kampagnen zur ROAS-Maximierung.",
        },
        {
          title: "KI- & Automatisierungs-Hebel",
          description:
            "Wir entwickeln maßgeschneiderte Pipelines und CRM-Zyklen, die Routineaufgaben automatisieren – damit volle mentale Kapazität für strategische Spitzenkreativität frei bleibt.",
        },
      ],
    },
  },
  contact: {
    header: {
      eyebrow: "Little Giant Labs",
      tagline: "Partnerschaftsanfrage",
      titlePart1: "Wachstum konzipiert für ",
      titleEmphasis: "die nächste Stufe",
      description:
        "Ein fundierter Dialog beginnt mit Kontext. Beschreiben Sie den aktuellen Stand Ihres Unternehmens, bestehende Wachstumsbremsen und Ihre strategischen Ziele.",
    },
    sidebar: {
      eyebrow: "Ein durchdachter Prozess",
      title: "Die richtige Wachstumspartnerschaft beginnt mit den richtigen Fragen",
      description:
        "Diese Anfrage vermittelt unserem Führungsteam den notwendigen Kontext zur Bewertung Ihrer Ziele, Rahmenbedingungen und Erwartungen.",
      tagline: "Intellekt. Medien. Kapital.",
    },
    form: {
      stepTitles: [
        "Unternehmensidentität & Positionierung",
        "Finanzprofil",
        "Strategische Hürden & Erwartungen",
        "Geschäftsleitungskontakt",
      ],
      stepAria: "Schritt {step} von 4",
      stepPrefix: "Schritt",
      fields: {
        enterpriseName: {
          label: "Wie lautet der offiziell eingetragene Name Ihres Unternehmens?",
          placeholder: "Offiziellen Firmennamen eingeben",
        },
        industry: {
          label: "In welchem Branchensegment strebt Ihre Marke die Marktführerschaft an?",
          legend: "Branchensegment",
          options: {
            "Enterprise Banking & FinTech": "Unternehmensbanking & FinTech",
            "Heavy Infrastructure & Real Estate": "Großinfrastruktur & Immobilien",
            "Premium Consumer Goods (D2C)": "Premium-Konsumgüter (D2C)",
            "Venture-Backed Technology": "Venture-finanzierte Technologie",
            "High-Ticket B2B Services": "Hochpreisige B2B-Dienstleistungen",
          },
        },
        revenue: {
          label: "Wie hoch war Ihr Jahresumsatz der letzten 12 Monate (TTM)?",
          legend: "Jahresumsatz (TTM)",
          options: {
            "Under $1 Million": "Unter 1 Million USD",
            "$1M – $5 Million": "1 – 5 Millionen USD",
            "$5M – $20 Million": "5 – 20 Millionen USD",
            "$20 Million+": "Über 20 Millionen USD",
          },
        },
        acquisitionSpend: {
          label: "Wie hoch ist Ihr derzeitiges monatliches Werbebudget für Kundenakquise?",
          legend: "Monatliches Akquisebudget",
          options: {
            "Under $10,000 / month": "Unter 10.000 USD / Monat",
            "$10,000 – $50,000 / month": "10.000 – 50.000 USD / Monat",
            "$50,000 – $150,000 / month": "50.000 – 150.000 USD / Monat",
            "$150,000+ / month": "Über 150.000 USD / Monat",
          },
          financialNote:
            "Finanzangaben dienen ausschließlich der internen Prüfung. Sie schließen niemanden pauschal von einer Anfrage aus.",
        },
        bottleneck: {
          label: "Was ist der primäre strukturelle Engpass, der Ihr digitales Wachstum derzeit bremst?",
          legend: "Wachstumsengpass",
          options: {
            "Ad platform algorithmic fatigue & dropping ROAS":
              "Algorithmus-Ermüdung auf Werbeplattformen & sinkender ROAS",
            "Inability to produce high-retention visual media at scale":
              "Mangelnde Kapazität für skalierbare High-Retention-Medieninhalte",
            "Lack of advanced attribution models and data tracking":
              "Fehlen fortschrittlicher Attributionsmodelle & präzisen Datentrackings",
            "Sub-optimal customer lifetime value (LTV) and backend CRM systems":
              "Unzureichender Customer Lifetime Value (LTV) & ineffizientes CRM",
          },
        },
        partnership: {
          label:
            "Wir arbeiten exklusiv als institutioneller Wachstumspartner mit monatlichen Betreuungspauschalen plus Performance-Beteiligungen. Suchen Sie einen einfachen Umsetzungsdienstleister oder verfügen Sie über das Kapital für eine marktführende Wachstumsarchitektur?",
          legend: "Partnerschaftserwartungen",
          options: {
            "We are looking for a cheap, hands-off execution vendor":
              "Wir suchen einen günstigen, reinen Umsetzungsdienstleister",
            "We are prepared to invest premium capital for institutional scale and long-term partnership":
              "Wir sind bereit, Premium-Kapital in institutionelle Skalierung und eine langfristige Partnerschaft zu investieren",
          },
        },
        corporateEmail: {
          instruction:
            "Geben Sie die direkte geschäftliche E-Mail-Adresse sowie das LinkedIn-Profil des verantwortlichen Entscheidungsträgers an (CEO, CMO oder Managing Partner).",
          label: "A. Geschäftliche E-Mail-Adresse",
          placeholder: "name@unternehmen.de",
          hint: "Bitte offizielle Firmen-E-Mail verwenden. Freemail-Adressen wie Gmail oder Yahoo werden nicht akzeptiert.",
          error: "Gültige geschäftliche E-Mail-Adresse angeben. Gmail- und Yahoo-Adressen sind unzulässig.",
        },
        linkedin: {
          label: "B. LinkedIn-Profil-URL",
          placeholder: "https://www.linkedin.com/in/ihr-profil",
          error: "Bitte eine gültige LinkedIn-Profil-URL angeben (z. B. https://www.linkedin.com/in/ihr-profil).",
        },
      },
      validationError: "Bitte füllen Sie alle Pflichtfelder aus und überprüfen Sie Ihre Angaben.",
      serverError: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
      back: "← Zurück",
      continue: "Weiter →",
      submit: "Anfrage senden",
      submitting: "Wird gesendet…",
    },
  },
  applicationReceived: {
    eyebrow: "Anfrage eingegangen",
    headlinePart1: "Der nächste Schritt ",
    headlineEmphasis: "liegt bei uns",
    body1:
      "Ihre Anfrage wurde erfolgreich übermittelt. Unser Führungsteam prüft Ihre Wachstumsziele, Rahmenbedingungen und strategischen Anforderungen sorgfältig.",
    body2:
      "Bei überzeugender Übereinstimmung mit unserem Kooperationsmodell werden wir uns bezüglich der nächsten Schritte mit Ihnen in Verbindung setzen.",
    tagline: "Little Giant Labs — Intellekt. Medien. Kapital.",
    returnHome: "Zurück zur Hauptseite ↗",
  },
  workUnavailable: {
    title: "Arbeiten | Vorübergehend nicht verfügbar",
    description: "Der Bereich für ausgewählte Arbeiten ist vorübergehend nicht verfügbar.",
    returnHome: "Zurück zur Hauptseite ↗",
  },
  workPage: {
    eyebrow: "Ausgewählte Projekte",
    title: "Im Portfolio von Bhairava Media vorgestellt.",
    attribution: "Diese sechs Projekte und ihre Kurzbeschreibungen stammen aus dem öffentlichen Portfolio von Bhairava Media. Eine Beteiligung von Little Giant Labs und die Genehmigung, sie als LGL-Arbeiten darzustellen, wurden nicht bestätigt. Bilder, Videos und nicht verifizierte Leistungsversprechen sind daher nicht enthalten.",
    sourceLink: "Zum Originalportfolio von Bhairava Media",
    filterLabel: "Projekte nach Kategorie filtern",
    allCategories: "Alle",
    searchLabel: "Projekte suchen",
    searchPlaceholder: "Projekte suchen",
    viewLabel: "Projektansicht",
    grid: "Raster",
    list: "Liste",
    previewLabel: "Projektvorschau",
    mediaPending: "Medienfreigabe ausstehend",
    exploreProject: "Projekt ansehen",
    readDetails: "Projektdetails lesen",
    noResults: "Keine Projekte gefunden",
    clearFilters: "Filter zurücksetzen",
    closeDetails: "Projektdetails schließen",
    sourceDetails: "Details bei Bhairava Media ansehen",
    projects: {
      "idfc-first-bank": { category: "Markteinführung", displayTag: "Emerging Banker", description: "IDFC FIRST Bank benötigte für sein Emerging Banker Program eine aufmerksamkeitsstarke Recruiting- und Markenpräsentation, um herausragende Finanztalente aus ganz Indien anzusprechen." },
      "quberx-brand-identity": { category: "Kreativdirektion", displayTag: "Brand Identity", description: "Quberx benötigte ein modernes, minimalistisches Markensystem und eine Asset-Bibliothek, um sich als zukunftsorientierter Technologieinnovator zu positionieren." },
      "adhyaksh-film-shoot": { category: "Markteinführung", displayTag: "", description: "Für den offiziellen Ankündigungsdreh von ‘Adhyaksh’ für Bhairava Films waren dynamische Werbeplakate und energiegeladene Social-Media-Inhalte gefragt." },
      "danny-pandit-brahmaa": { category: "Social-Media-Inhalte", displayTag: "", description: "Das Projekt sollte Aufmerksamkeit und virale Reichweite für den offiziellen Anthem-Launch mit Danny Pandit und Brahmaa schaffen." },
      "erik-vinmayi-96": { category: "Film und Musik", displayTag: "", description: "Eine nostalgische, emotionale visuelle Kampagne zur Veröffentlichung des Musiktitels ‘96’." },
      "commercial-adshoot-series": { category: "Performance-Werbung", displayTag: "", description: "Eine humorvolle, nahbare Werbeserie, die in sozialen Feeds die Aufmerksamkeit von Gen Z und Millennials gewinnen sollte." },
    },
  },
  footer: {
    ctaEyebrow: "Lassen Sie uns Sprechen",
    ctaHeading1: "Erschaffen wir",
    ctaHeading2: "etwas Herausragendes",
    brandTagline: "Filmische Kreativität und Performance-Wachstum für Marken mit Skalierungsambitionen.",
    navHeading: "Navigation",
    connectHeading: "Kontakt",
    officeHeading: "Standort",
    location: "PUNE, IN",
    localTimePrefix: "Ortszeit:",
    copyright: "Little Giant Labs. Alle Rechte vorbehalten.",
    slogan: "Geschaffen für Bewegung, Geschichten und Wachstum.",
  },
  seo: {
    home: {
      title: "Little Giant Labs",
      description:
        "Ein modernes Medien- und Marketing-Labor für den Aufbau dominanter Markenpräsenz durch innovative Inhalte, Digitalmarketing und KI-Lösungen.",
    },
    about: {
      title: "Über Uns",
      description:
        "Erfahren Sie mehr über unsere Vision, Geschäftsführung und wie Little Giant Labs führende Marken durch filmische Medien und Performance-Architektur skaliert.",
    },
    contact: {
      title: "Partnerschaftsanfrage",
      description:
        "Bewerben Sie sich für eine institutionelle Wachstumspartnerschaft. Teilen Sie Ihre Ziele, Kennzahlen und strategischen Herausforderungen.",
    },
    work: {
      title: "Ausgewählte Arbeiten",
      description: "Entdecken Sie unser Portfolio wirkungsvoller Kreativkampagnen und Performance-Wachstumssysteme.",
    },
    applicationReceived: {
      title: "Anfrage eingegangen",
      description: "Ihre Anfrage ist bei uns eingegangen. Unser Team wird sie prüfen.",
    },
  },
};
