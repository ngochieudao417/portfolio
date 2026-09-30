import type { Locale } from "../types";
import { en, type Dictionary } from "./en";
import { vi } from "./vi";

export const locales: Locale[] = ["en", "vi"];
export const defaultLocale: Locale = "en";

export const dictionaries: Record<Locale, Dictionary> = { en, vi };

export type { Dictionary };
