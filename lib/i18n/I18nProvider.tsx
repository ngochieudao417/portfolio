"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultLocale, dictionaries, type Dictionary } from "@/content/translations";
import type { Locale, Localized } from "@/content/types";
import { readStorage, STORAGE_KEYS, writeStorage } from "@/lib/utils/storage";

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** UI dictionary for the active locale. */
  t: Dictionary;
  /** Picks the active-locale value out of a `Localized` content field. */
  l: <T>(value: Localized<T>) => T;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = readStorage(STORAGE_KEYS.locale);
    if (stored === "en" || stored === "vi") setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeStorage(STORAGE_KEYS.locale, next);
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
      l: (field) => field[locale],
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
