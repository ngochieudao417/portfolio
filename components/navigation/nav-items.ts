import type { Dictionary } from "@/content/translations";

type NavKey = keyof Pick<
  Dictionary["nav"],
  "home" | "about" | "projects" | "research" | "journey" | "skills" | "education" | "certifications" | "contact"
>;

export interface NavItem {
  /** Section id on the home page. */
  id: string;
  key: NavKey;
  /** Shown in the desktop navbar (the palette and terminal know every section). */
  primary: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "top", key: "home", primary: true },
  { id: "about", key: "about", primary: true },
  { id: "projects", key: "projects", primary: true },
  { id: "research", key: "research", primary: true },
  { id: "journey", key: "journey", primary: true },
  { id: "skills", key: "skills", primary: false },
  { id: "education", key: "education", primary: true },
  { id: "certifications", key: "certifications", primary: true },
  { id: "contact", key: "contact", primary: true },
];
