"use client";

import { locales } from "@/content/translations";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils/cn";

/** EN / VI segmented control. */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t.language.label}
      className={cn("flex items-center rounded-lg border border-line p-0.5 font-mono text-xs", className)}
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            onClick={() => setLocale(code)}
            className={cn(
              "h-7 rounded-md px-2 uppercase tracking-wider transition-colors",
              active ? "bg-surface-2 text-fg" : "text-subtle hover:text-fg",
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
