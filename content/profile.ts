import type { Domain, Localized, Repo } from "./types";

export interface RolePart {
  text: string;
  domain?: Domain;
}

export interface Profile {
  name: string;
  asciiName: string;
  initials: string;
  handle: string;
  role: Localized<RolePart[]>;
  roleText: Localized;
  location: Localized;
  coordinates: string;
  email: string;
  phone: string;
  socials: { github: string; linkedin: string };
  portrait: { src: string; alt: Localized };
  cv: { src: string; fileName: string };
  availability: { open: boolean };
  github: { enabled: boolean; selectedRepos: Repo[] };
}

/**
 * Single source of truth for identity and public contact details.
 * Components never hard-code any of these values.
 *
 * Empty values are hidden.
 */
export const profile: Profile = {
  name: "Đào Ngọc Hiếu",
  asciiName: "Dao Ngoc Hieu",
  initials: "ĐNH",
  handle: "hieu",

  /** Role, split so each discipline can carry its domain accent. */
  role: {
    en: [
      { text: "AI", domain: "ai" },
      { text: " / " },
      { text: "R&D", domain: "research" },
      { text: " / " },
      { text: "Automation", domain: "automation" },
      { text: " Engineer" },
    ],
    vi: [
      { text: "Kỹ sư " },
      { text: "AI", domain: "ai" },
      { text: " / " },
      { text: "R&D", domain: "research" },
      { text: " / " },
      { text: "Tự động hoá", domain: "automation" },
    ],
  },
  roleText: {
    en: "AI / R&D / Automation Engineer",
    vi: "Kỹ sư AI / R&D / Tự động hoá",
  },

  location: { en: "Hanoi, Vietnam", vi: "Hà Nội, Việt Nam" },
  /** Hanoi city centre — shown as a small caption under the portrait. */
  coordinates: "21.03°N 105.85°E",

  email: "daongochieu.tech@gmail.com",
  phone: "+84 358 504 383",
  socials: {
    github: "https://github.com/ngochieudao417",
    linkedin: "https://www.linkedin.com/in/dao-ngoc-hieu/",
  },

  /** Drop the photo at public/images/profile.jpg — the placeholder disappears automatically. */
  portrait: {
    src: "/images/profile.jpg",
    alt: {
      en: "Portrait of Đào Ngọc Hiếu",
      vi: "Ảnh chân dung Đào Ngọc Hiếu",
    },
  },

  /** Drop the PDF at this path. Until then, CV buttons become "Request CV". */
  cv: {
    src: "/resume/Dao-Ngoc-Hieu-CV.pdf",
    fileName: "Dao-Ngoc-Hieu-CV.pdf",
  },

  availability: {
    open: true,
  },

  github: {
    enabled: true,
    /** Optional, manually curated. No live GitHub API dependency. */
    selectedRepos: [],
  },
};
