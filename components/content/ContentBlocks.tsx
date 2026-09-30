"use client";

import { Pending } from "@/components/ui/Pending";
import { ZoomableImage } from "@/components/ui/ZoomableImage";
import { site } from "@/content/site";
import type { ChartData, ContentBlock, Domain, ImageAsset, Metric, Schematic as SchematicData } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { MetricChart } from "./MetricChart";
import { MetricGrid } from "./MetricGrid";
import { Schematic } from "./Schematic";
import { Screenshots } from "./Screenshots";

/** Everything a block's `visual` may draw on. */
export interface BlockContext {
  accent: Domain;
  schematic?: SchematicData;
  schematicLabel: string;
  metrics: Metric[];
  chart: ChartData | null;
  screenshots: ImageAsset[];
  /** Source file shown in dev TODO markers. */
  source: string;
}

function hasVisual(block: ContentBlock, ctx: BlockContext): boolean {
  switch (block.visual) {
    case "schematic":
      return Boolean(ctx.schematic);
    case "metrics":
      return ctx.metrics.length > 0;
    case "chart":
      return Boolean(ctx.chart && ctx.chart.series.some((s) => s.points.length > 0));
    case "screenshots":
      return ctx.screenshots.length > 0;
    default:
      return false;
  }
}

function hasText(block: ContentBlock): boolean {
  return Boolean(block.body || block.bullets || block.math?.length || block.image);
}

/** Blocks with nothing to show are hidden in production (and flagged in development). */
export function isBlockEmpty(block: ContentBlock, ctx: BlockContext): boolean {
  return !hasText(block) && !hasVisual(block, ctx);
}

export function BlockBody({ block, ctx }: { block: ContentBlock; ctx: BlockContext }) {
  const { t, l } = useI18n();
  const text = hasText(block);
  const visual = hasVisual(block, ctx);

  return (
    <div className="space-y-4">
      {block.body &&
        l(block.body)
          .split("\n\n")
          .map((paragraph, i) => (
            <p key={i} className="text-[0.9375rem] leading-relaxed text-fg/90 md:text-base">
              {paragraph}
            </p>
          ))}

      {block.bullets && (
        <ul className="space-y-1.5">
          {l(block.bullets).map((item) => (
            <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-fg/90">
              <span aria-hidden="true" className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {block.math && block.math.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-line bg-surface-2/70 px-4 py-3">
          {block.math.map((line) => (
            <p key={line} className="whitespace-nowrap font-mono text-[0.9375rem] leading-8 text-fg">
              {line}
            </p>
          ))}
        </div>
      )}

      {block.image && (
        <ZoomableImage image={block.image} className="aspect-[16/10] max-w-xl" sizes="(min-width: 768px) 576px, 90vw" />
      )}

      {visual && block.visual === "schematic" && ctx.schematic && (
        <figure>
          <div className="aspect-[16/9] overflow-hidden rounded-lg border border-line bg-surface-2/60">
            <Schematic data={ctx.schematic} accent={ctx.accent} label={ctx.schematicLabel} live />
          </div>
          <figcaption className="mt-2 font-mono text-xs text-subtle">{t.common.illustrative}</figcaption>
        </figure>
      )}
      {visual && block.visual === "metrics" && <MetricGrid metrics={ctx.metrics} />}
      {visual && block.visual === "chart" && ctx.chart && <MetricChart chart={ctx.chart} />}
      {visual && block.visual === "screenshots" && <Screenshots images={ctx.screenshots} />}

      {!text && !visual && <Pending what={`"${block.id}" — ${l(block.title)}`} where={ctx.source} />}
      {text && block.visual && !visual && block.visual !== "schematic" && (
        <Pending what={`${block.visual} data for "${block.id}"`} where={ctx.source} />
      )}
    </div>
  );
}

interface ContentBlocksProps {
  blocks: ContentBlock[];
  ctx: BlockContext;
  /** "case" = numbered case-study sections; "notebook" = Jupyter-style cells. */
  variant: "case" | "notebook";
}

export function ContentBlocks({ blocks, ctx, variant }: ContentBlocksProps) {
  const { l } = useI18n();
  const visible = blocks.filter((block) => site.showPlaceholders || !isBlockEmpty(block, ctx));
  if (visible.length === 0) return null;

  if (variant === "notebook") {
    return (
      <ol className="space-y-3">
        {visible.map((block, index) => (
          <li key={block.id} className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-3 sm:grid-cols-[4.5rem_minmax(0,1fr)]">
            <span className="pt-3 text-right font-mono text-[0.6875rem] text-subtle sm:text-xs">
              In [<span className="text-accent">{index + 1}</span>]:
            </span>
            <div className="min-w-0 rounded-lg border border-line bg-surface px-4 py-3.5 transition-colors focus-within:border-line-strong hover:border-line-strong">
              <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                <span className="text-accent">##</span> {l(block.title)}
              </h4>
              <BlockBody block={block} ctx={ctx} />
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className="space-y-10">
      {visible.map((block, index) => (
        <li key={block.id} className="grid gap-3 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
          <h3 className="flex items-baseline gap-3 font-mono text-sm font-semibold text-fg md:flex-col md:gap-1">
            <span className="text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
            <span className="uppercase tracking-[0.12em]">{l(block.title)}</span>
          </h3>
          <BlockBody block={block} ctx={ctx} />
        </li>
      ))}
    </ol>
  );
}
