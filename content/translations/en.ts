import type { Domain } from "../types";

export interface StatementPart {
  text: string;
  domain?: Domain;
}

/**
 * English UI copy (default locale). `vi.ts` must match this shape exactly —
 * the `Dictionary` type enforces it at compile time.
 */
export const en = {
  common: {
    close: "Close",
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "Email",
    phone: "Phone",
    location: "Location",
    demo: "Live demo",
    paper: "Paper",
    repository: "Repository",
    slides: "Slides",
    fullPage: "Open full page",
    back: "Back to portfolio",
    copy: "Copy",
    copied: "Copied to clipboard",
    newTab: "(opens in a new tab)",
    techStack: "Tech stack",
    illustrative: "Illustrative schematic — not measured data.",
    dataTable: "View data table",
    article: "Read article",
    viewFull: "View full size",
  },

  domains: {
    ai: "AI / ML",
    research: "Research",
    automation: "Automation",
    data: "Data",
    seo: "SEO / Marketing",
  },

  nav: {
    label: "Primary",
    home: "Home",
    about: "About",
    projects: "Projects",
    research: "Research",
    journey: "Journey",
    skills: "Skills",
    education: "Education",
    certifications: "Certifications",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Menu",
    skip: "Skip to content",
    logoLabel: "Đào Ngọc Hiếu — back to top",
    preferences: "Preferences",
  },

  cv: {
    download: "Download CV",
    request: "Request CV",
    requestSubject: "CV request",
  },

  theme: {
    label: "Theme",
    toDark: "Switch to dark theme",
    toLight: "Switch to light theme",
    dark: "Dark",
    light: "Light",
  },

  language: {
    label: "Language",
    switchTo: "Chuyển sang tiếng Việt",
  },

  recruiter: {
    label: "Recruiter mode",
    short: "Recruiter",
    description: "Fewer effects, faster scanning",
    on: "Recruiter mode on — fewer effects, content first.",
    off: "Recruiter mode off.",
    summary: {
      eyebrow: "At a glance",
      title: "The 30-second version",
      who: "Who",
      focus: "Focus",
      experience: "Experience",
      research: "Research",
      education: "Education",
      highlights: "Highlights",
      contact: "Contact",
    },
  },

  hero: {
    status: "Open to opportunities",
    statement: [
      { text: "I " },
      { text: "build", domain: "ai" },
      { text: ", " },
      { text: "research", domain: "research" },
      { text: ", and " },
      { text: "automate", domain: "automation" },
      { text: "." },
    ] as StatementPart[],
    intro:
      "I work where AI, research, automation and data meet real-world problems — from LLM-powered tools and quantum–classical experiments to workflows that run themselves.",
    explore: "Explore my work",
    scroll: "Scroll",
    paletteHint: "for commands",
    portraitCaption: "fig. 01",
    portraitPending: "portrait pending",
  },

  about: {
    eyebrow: "About",
    title: "From curiosity to systems that hold up in the real world.",
    story: [
      {
        label: "Curiosity",
        text: "It started with wanting to know how things work — and how technology could make them work better. That question brought me to Information Technology at National Economics University.",
      },
      {
        label: "Building",
        text: "I learn fastest by building. Web apps and APIs came first, then AI: a CV reviewer that runs a quantized LLM locally, and a desktop app that localizes short videos end to end.",
      },
      {
        label: "Research",
        text: "Building raised questions that engineering alone couldn't answer, which pulled me into research: how ChatGPT shapes students' independent thinking, then quantum methods for molecular energies, dengue forecasting with QAAA LAB, and vehicular edge computing.",
      },
      {
        label: "Experimentation",
        text: "Research taught me to treat ideas as experiments: define the question, measure honestly, and report what didn't work — including a hypothesis my own data refuted and a bug in a published baseline. At SEA Quantathon 2026 our QAAA LAB team took First Prize with quantum-enhanced dengue forecasting.",
      },
      {
        label: "Real-world application",
        text: "What I care about most is where the work lands — automating repetitive workflows, leading data collection at Saltlux, and understanding the business side (SEO, marketing, analytics) well enough to build things people actually use.",
      },
    ],
    focusTitle: "Current focus",
    focusDescription: "Five areas I'm actively working in — directions, not a skill meter.",
    focusCta: "See related work",
  },

  projects: {
    eyebrow: "Projects",
    title: "Things I've built and studied.",
    description:
      "Four flagship projects across AI, research and automation. Each card opens a technical case study.",
    filterLabel: "Filter projects by category",
    featured: "Featured",
    all: "All",
    empty: "No public projects in this category yet.",
    showing: (count: number) => `${count} ${count === 1 ? "project" : "projects"} shown`,
    moreTitle: "More projects",
    moreDescription: "Smaller builds, experiments and prototypes.",
    moreEmpty: "Smaller experiments will appear here.",
    viewCaseStudy: "View case study",
    caseStudy: "Case study",
    deepDive: "Deep dive",
    deepDiveHide: "Hide deep dive",
    deepDiveHint: "Open the research notebook — model details, setup, metrics and results.",
    githubTitle: "More code on GitHub",
    githubDescription: "Repositories, experiments and work in progress.",
    githubCta: "View GitHub profile",
    selectedRepos: "Selected repositories",
    nextProject: "Next project",
    previousProject: "Previous project",
  },

  research: {
    eyebrow: "Research Lab",
    title: "Questions I'm working on.",
    description:
      "Start with the overview. Open a notebook when you want the method, the math and the results.",
    domain: "Domain",
    role: "Role",
    status: "Status",
    venue: "Competition / paper",
    keyResult: "Key result",
    openNotebook: "Open notebook",
    closeNotebook: "Close notebook",
    kernel: "kernel",
    ready: "ready",
    chartHint: "Hover or tap the chart to inspect values.",
  },

  journey: {
    eyebrow: "Career Journey",
    title: "The path so far.",
    description: "Education, work, research and competitions — expand any milestone for details.",
    expand: "Show details",
    collapse: "Hide details",
    responsibilities: "Responsibilities",
    achievements: "Achievements",
    technologies: "Technologies",
    relatedProjects: "Related projects",
    types: {
      education: "Education",
      work: "Work",
      research: "Research",
      award: "Award",
    },
  },

  skills: {
    eyebrow: "Skills",
    title: "Tools I work with.",
    description: "Grouped by domain. No percentage bars — the projects are the evidence.",
  },

  education: {
    eyebrow: "Education",
    title: "Academic foundation.",
    program: "Program",
    period: "Period",
    gpa: "GPA",
    achievements: "Academic achievements",
    research: "Student research",
  },

  certifications: {
    eyebrow: "Certifications",
    title: "Credentials.",
    issuer: "Issuer",
    year: "Year",
    verify: "Verify online",
    viewDiploma: "View diploma",
    credentialId: "Credential ID",
  },

  beyond: {
    eyebrow: "Beyond tech",
    title: "Outside the editor.",
  },

  contact: {
    eyebrow: "Contact",
    title: "Have an opportunity? Let's talk.",
    description:
      "I'm open to roles and collaborations across AI, R&D, automation and data — and technology/business roles where SEO and analytics matter.",
    openTo: "Open to",
    openToItems: ["AI", "R&D", "Automation", "Data", "Technology / Business", "SEO / Analytics"],
    contactMe: "Contact me",
    direct: "Reach me directly",
    copyEmail: "Copy email address",
    form: {
      title: "Send a message",
      name: "Name",
      email: "Email",
      message: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "you@company.com",
      messagePlaceholder: "What are you working on?",
      submit: "Send message",
      sending: "Sending…",
      success: "Thanks — your message is on its way. I'll reply by email.",
      error: "Your message couldn't be sent.",
      errorFallback: "Please email me directly instead:",
      privacy: "Your details are only used to reply to you.",
      unavailableTitle: "The form is offline right now",
      unavailable: "Messages can't be sent from this page at the moment. You can still reach me directly:",
      errors: {
        nameRequired: "Please enter your name.",
        emailRequired: "Please enter your email.",
        emailInvalid: "That email address doesn't look right.",
        messageRequired: "Please write a message.",
        messageShort: "A little more detail, please (at least 10 characters).",
        messageLong: "That's a bit long — please keep it under 5,000 characters.",
        rateLimited: "Too many messages in a short time. Please try again later.",
      },
    },
  },

  footer: {
    tagline: "Build. Research. Automate.",
    palette: "Command palette",
  },

  palette: {
    label: "Command palette",
    placeholder: "Type a command or search…",
    empty: "No matching commands.",
    hint: "↑↓ move · ↵ select · esc close",
    groups: {
      navigate: "Navigate",
      projects: "Projects",
      actions: "Actions",
      lab: "Lab",
    },
    actions: {
      toggleTheme: "Toggle light / dark theme",
      toggleLanguage: "Chuyển sang tiếng Việt",
      toggleRecruiter: "Toggle recruiter mode",
      downloadCv: "Download CV",
      copyEmail: "Copy email address",
      openGithub: "Open GitHub",
      openLinkedin: "Open LinkedIn",
      openTerminal: "Open terminal",
      measure: "Measure the lab's quantum state",
    },
  },

  terminal: {
    title: "hieu@lab: ~",
    label: "Terminal",
    welcome: "hieu-lab shell — type `help` to list commands, `exit` to close.",
    inputLabel: "Terminal command",
    notFound: "command not found",
    tryHelp: "type `help` for a list of commands",
    usage: "usage",
    help: {
      help: "list commands",
      whoami: "who is this?",
      about: "the short story",
      ls: "list projects | research | certs",
      open: "open a project, research entry or section",
      cv: "download (or request) the CV",
      contact: "how to reach me",
      theme: "switch theme — dark | light",
      lang: "switch language — en | vi",
      recruiter: "recruiter mode — on | off",
      measure: "collapse a superposition",
      clear: "clear the screen",
      exit: "close the terminal",
    },
    opening: "opening",
    unknownTarget: "nothing called",
    done: "done",
    noContact: "contact details not published yet — use the form in #contact",
    hireMe: "[sudo] password for recruiter: ********\naccess granted. routing you to #contact…",
    measurePrep: "preparing |ψ⟩ = (|build⟩ + |research⟩ + |automate⟩) / √3",
    measureResult: "measured →",
  },

  quantum: {
    collapsed: "Wavefunction collapsed →",
  },

  notFound: {
    title: "State not found.",
    description: "This page collapsed into |404⟩. The rest of the lab is still here.",
    home: "Back to the lab",
  },
};

export type Dictionary = typeof en;
