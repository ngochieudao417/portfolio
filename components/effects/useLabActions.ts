"use client";

import { useMemo } from "react";
import { useAsset } from "@/components/layout/AssetsProvider";
import { useNavigateTo } from "@/components/navigation/useNavigateTo";
import { useRecruiterMode } from "@/components/recruiter-mode/RecruiterModeProvider";
import { useTheme, type Theme } from "@/components/theme/ThemeProvider";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { measureLabState } from "@/lib/quantum";
import { showToast } from "@/lib/ui-state";

/** Site actions shared by the command palette and the terminal. */
export function useLabActions() {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  const recruiter = useRecruiterMode();
  const navigateTo = useNavigateTo();
  const cv = useAsset(profile.cv.src);

  return useMemo(
    () => ({
      navigateTo,
      theme,
      setTheme: (next: Theme) => setTheme(next),
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
      locale,
      setLocale: (next: Locale) => setLocale(next),
      toggleLocale: () => setLocale(locale === "en" ? "vi" : "en"),
      recruiter: recruiter.enabled,
      setRecruiter: (on: boolean) => {
        recruiter.setEnabled(on);
        showToast(on ? t.recruiter.on : t.recruiter.off, "seo");
      },
      cvAvailable: Boolean(cv),
      openCv: () => {
        if (cv) {
          const link = document.createElement("a");
          link.href = cv;
          link.download = profile.cv.fileName;
          link.click();
        } else if (profile.email) {
          window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`${t.cv.requestSubject} — ${profile.name}`)}`;
        } else {
          navigateTo("#contact");
        }
      },
      copyEmail: async () => {
        if (!profile.email) return;
        try {
          await navigator.clipboard.writeText(profile.email);
          showToast(t.common.copied, "seo");
        } catch {
          window.location.href = `mailto:${profile.email}`;
        }
      },
      openExternal: (url: string) => window.open(url, "_blank", "noopener,noreferrer"),
      measure: () => {
        const outcome = measureLabState();
        showToast(`${t.quantum.collapsed} |${outcome.label}⟩`, outcome.domain);
        return outcome;
      },
    }),
    [cv, locale, navigateTo, recruiter, setLocale, setTheme, t, theme],
  );
}

export type LabActions = ReturnType<typeof useLabActions>;
