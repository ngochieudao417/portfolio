"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { openOverlay } from "@/lib/ui-state";
import { cn } from "@/lib/utils/cn";

/** "⌘K for commands" — a quiet invitation to the command palette. */
export function PaletteHint({ className, label }: { className?: string; label?: string }) {
  const { t } = useI18n();
  const [modifier, setModifier] = useState("Ctrl");

  useEffect(() => {
    if (/Mac|iPhone|iPad/i.test(navigator.userAgent)) setModifier("⌘");
  }, []);

  return (
    <button
      type="button"
      onClick={() => openOverlay("palette")}
      className={cn(
        "items-center gap-2 rounded-md px-1.5 py-1 font-mono text-xs text-subtle transition-colors hover:text-fg",
        className,
      )}
    >
      <kbd className="rounded border border-line-strong bg-surface-2 px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted">
        {modifier} K
      </kbd>
      {label ?? t.hero.paletteHint}
    </button>
  );
}
