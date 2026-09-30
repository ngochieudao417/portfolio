"use client";

import { useNavigateTo } from "@/components/navigation/useNavigateTo";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Domain, FocusArea } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { projectFilterStore } from "@/lib/ui-state";
import { accentStyle } from "@/lib/utils/domains";

const ICONS: Record<Domain, IconName> = {
  ai: "sparkle",
  research: "atom",
  automation: "terminal",
  data: "search",
  seo: "arrowUpRight",
};

export function FocusCard({ area, index }: { area: FocusArea; index: number }) {
  const { t, l } = useI18n();
  const navigateTo = useNavigateTo();

  const go = () => {
    if (area.target.kind === "filter") {
      projectFilterStore.set(area.target.domain);
      navigateTo("#projects");
    } else {
      navigateTo(`#${area.target.id}`);
    }
  };

  return (
    <li style={accentStyle(area.domain)}>
      <button
        type="button"
        onClick={go}
        className="group relative flex w-full items-start gap-4 overflow-hidden rounded-lg border border-line bg-surface px-4 py-4 text-left transition-colors hover:border-[color-mix(in_oklab,var(--accent)_45%,transparent)]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100"
        />
        <span className="grid size-9 shrink-0 place-items-center rounded-md border border-line bg-surface-2 text-accent">
          <Icon name={ICONS[area.domain]} size={16} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-sm font-semibold text-fg">{l(area.title)}</span>
            <span className="font-mono text-[0.6875rem] text-subtle">0{index + 1}</span>
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-muted">{l(area.line)}</span>
          <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs text-accent opacity-80 transition-opacity group-hover:opacity-100">
            {t.about.focusCta}
            <Icon name="arrowRight" size={13} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </span>
      </button>
    </li>
  );
}
