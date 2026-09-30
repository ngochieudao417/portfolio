"use client";

import { ContentBlocks, type BlockContext } from "@/components/content/ContentBlocks";
import type { ResearchEntry } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { accentStyle } from "@/lib/utils/domains";

export function researchContext(entry: ResearchEntry, label: string): BlockContext {
  return {
    accent: entry.accent,
    schematic: entry.schematic,
    schematicLabel: label,
    metrics: entry.metrics,
    chart: entry.chart,
    screenshots: [],
    source: "content/research.ts",
  };
}

/** Layer 2 of the Research Lab: a Jupyter-style notebook of the technical detail. */
export function ResearchDeepDive({ entry }: { entry: ResearchEntry }) {
  const { t, l } = useI18n();
  const ctx = researchContext(entry, `${l(entry.title)} — ${entry.schematic.nodes.join(" → ")}`);

  return (
    <div style={accentStyle(entry.accent)} className="overflow-hidden rounded-xl border border-line bg-bg-elevated">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5 font-mono text-xs text-muted">
        <span className="flex items-center gap-2 truncate">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
          </span>
          <span className="ml-2 truncate text-fg">{entry.slug}.ipynb</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {t.research.kernel}
          <span className="size-1.5 rounded-full bg-[var(--accent-seo)]" aria-hidden="true" />
          {t.research.ready}
        </span>
      </div>
      <div className="lab-grid p-3 sm:p-5">
        <ContentBlocks blocks={entry.notebook} ctx={ctx} variant="notebook" />
      </div>
    </div>
  );
}
