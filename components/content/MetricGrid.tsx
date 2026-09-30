"use client";

import type { Metric } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";

/** Stat tiles for supplied (never invented) metrics. */
export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  const { l } = useI18n();
  return (
    <dl className={metrics.length % 2 === 0 && metrics.length % 3 !== 0 ? "grid gap-3 sm:grid-cols-2" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
      {metrics.map((metric) => (
        <div key={metric.label.en} className="rounded-lg border border-line bg-surface p-4">
          <dt className="text-sm text-muted">{l(metric.label)}</dt>
          <dd className="mt-1">
            <span className="font-sans text-3xl font-semibold tracking-tight text-fg">{metric.value}</span>
            {metric.unit && <span className="ml-1 font-mono text-sm text-muted">{metric.unit}</span>}
            {metric.note && <span className="mt-1 block text-xs text-subtle">{l(metric.note)}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
