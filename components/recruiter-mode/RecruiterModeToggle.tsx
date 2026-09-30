"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { showToast } from "@/lib/ui-state";
import { cn } from "@/lib/utils/cn";
import { useRecruiterMode } from "./RecruiterModeProvider";

/** The visible RECRUITER MODE switch in the navbar. */
export function RecruiterModeToggle({ className }: { className?: string }) {
  const { enabled, setEnabled } = useRecruiterMode();
  const { t } = useI18n();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      title={t.recruiter.description}
      onClick={() => {
        setEnabled(!enabled);
        showToast(enabled ? t.recruiter.off : t.recruiter.on, "seo");
      }}
      className={cn(
        "group flex h-9 items-center gap-2.5 rounded-lg border px-2.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] transition-colors",
        enabled
          ? "border-[color:var(--accent-seo)] bg-[color-mix(in_oklab,var(--accent-seo)_12%,transparent)] text-fg"
          : "border-line text-muted hover:border-line-strong hover:text-fg",
        className,
      )}
    >
      <span className="hidden sm:inline">{t.recruiter.label}</span>
      <span className="sm:hidden">{t.recruiter.short}</span>
      <span
        aria-hidden="true"
        className={cn(
          "relative h-4 w-7 shrink-0 rounded-full transition-colors",
          enabled ? "bg-[var(--accent-seo)]" : "bg-line-strong",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-3 rounded-full bg-bg transition-transform",
            enabled ? "translate-x-3.5" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}
