import type { CSSProperties } from "react";
import type { Domain } from "@/content/types";

export const DOMAINS: Domain[] = ["ai", "research", "automation", "data", "seo"];

/** CSS custom property holding a domain's accent colour (defined in globals.css). */
export function domainColor(domain: Domain | undefined): string {
  return domain ? `var(--accent-${domain})` : "var(--fg)";
}

/** Inline style that re-points `--accent` (and every `*-accent` utility) at a domain. */
export function accentStyle(domain: Domain | undefined): CSSProperties {
  return { "--accent": domainColor(domain) } as CSSProperties;
}
