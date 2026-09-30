/**
 * Content schema. Everything the site renders comes from objects typed here,
 * so content can be edited without touching UI components.
 *
 * Conventions
 * - An empty string ("") or null means "not provided yet". The UI hides it in
 *   production and shows a "// TODO" marker in development.
 * - Never fill a field with invented facts just to make a section look complete.
 */

export type Locale = "en" | "vi";

export type Localized<T = string> = { en: T; vi: T };

export type Domain = "ai" | "research" | "automation" | "data" | "seo";

export interface ImageAsset {
  /** Path under /public, e.g. "/projects/ai-cv-review/cover.jpg". */
  src: string;
  alt: Localized;
}

export interface Metric {
  label: Localized;
  value: string;
  unit?: string;
  note?: Localized;
}

export interface ChartSeries {
  name: string;
  points: Array<[x: number, y: number]>;
}

export interface ChartData {
  title: Localized;
  xLabel: Localized;
  yLabel: Localized;
  series: ChartSeries[];
}

export type SchematicLayout = "linear" | "snake" | "loop" | "branch";

/** Abstract pipeline drawing used as a visual preview / architecture sketch. */
export interface Schematic {
  layout: SchematicLayout;
  nodes: string[];
  /** Optional label drawn in the middle of a "loop" layout. */
  center?: string;
}

export type BlockVisual = "schematic" | "metrics" | "chart" | "screenshots";

/**
 * A section of a case study or a cell of a research notebook.
 * A block with no body, bullets, math or visual data is treated as pending.
 */
export interface ContentBlock {
  id: string;
  title: Localized;
  body?: Localized;
  bullets?: Localized<string[]>;
  /** Plain-text formula lines, rendered in monospace. */
  math?: string[];
  visual?: BlockVisual;
  /** Optional photo shown with the block (e.g. an award ceremony). */
  image?: ImageAsset;
}

export interface ProjectLinks {
  github?: string;
  demo?: string;
  paper?: string;
  /** News / announcement article about the work. */
  article?: string;
}

export interface Project {
  slug: string;
  /** Display index for featured projects, e.g. "01". */
  index?: string;
  title: string;
  featured: boolean;
  /** Primary accent / identity of the project. */
  accent: Domain;
  /** Every category the project belongs to (used by the filter). */
  domains: Domain[];
  category: Localized;
  summary: Localized;
  /** Short recognition line shown on the card, e.g. an award. */
  highlight?: Localized;
  tags: string[];
  year?: string;
  schematic: Schematic;
  cover: ImageAsset | null;
  screenshots: ImageAsset[];
  metrics: Metric[];
  chart: ChartData | null;
  links: ProjectLinks;
  caseStudy: ContentBlock[];
  /** Slug of a research entry whose notebook is offered as a "Deep Dive". */
  research?: string;
}

export interface ResearchEntry {
  slug: string;
  code: string;
  title: Localized;
  accent: Domain;
  domains: Domain[];
  abstract: Localized;
  role: Localized | null;
  status: Localized | null;
  venue: Localized | null;
  keyResult: Localized | null;
  links: { paper?: string; repo?: string; slides?: string; article?: string };
  /** Related featured project, if any. */
  project?: string;
  schematic: Schematic;
  metrics: Metric[];
  chart: ChartData | null;
  notebook: ContentBlock[];
}

export type JourneyType = "education" | "work" | "research" | "award";

export interface JourneyItem {
  id: string;
  type: JourneyType;
  org: string;
  role: Localized;
  period: string;
  domains: Domain[];
  summary?: Localized;
  responsibilities?: Localized<string[]>;
  achievements?: Localized<string[]>;
  technologies?: string[];
  relatedProjects?: string[];
  /** Shown in the recruiter "At a glance" summary. */
  highlight?: boolean;
  /** Announcement / article about this milestone. */
  link?: string;
  image?: ImageAsset;
}

export interface Achievement {
  title: Localized;
  year?: string;
  detail?: Localized;
}

export interface EducationItem {
  id: string;
  institution: string;
  localName?: string;
  short: string;
  program: Localized;
  period: string;
  location: Localized;
  gpa: string | null;
  logo: ImageAsset | null;
  achievements: Achievement[];
  /** Student research project, shown with its team photo. */
  research?: {
    title: Localized;
    summary: Localized;
    facts: Localized<string[]>;
    link: string;
    image: ImageAsset | null;
    year?: string;
  };
}

export interface Credential {
  id: string;
  name: string;
  issuer: string;
  year: string;
  /** Human-readable period, e.g. "May – June 2026". */
  period?: string;
  description?: Localized;
  /** As printed on the credential — never invented. */
  credentialId?: string;
  /** Online verification link, if one exists. */
  url: string;
  /** Scan / photo of the credential. */
  image: ImageAsset | null;
}

export interface SkillGroup {
  id: string;
  title: Localized;
  domain?: Domain;
  items: string[];
}

export interface FocusArea {
  domain: Domain;
  title: Localized;
  line: Localized;
  /** Where the card leads: a project filter or a section anchor. */
  target: { kind: "filter"; domain: Domain } | { kind: "section"; id: string };
}

export interface BeyondItem {
  id: string;
  title: Localized;
  org: string;
  body: Localized;
  tags: Localized<string[]>;
  link?: string;
  image?: ImageAsset;
}

export interface Repo {
  name: string;
  url: string;
  description: Localized;
  language?: string;
}
