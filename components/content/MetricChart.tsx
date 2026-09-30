"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { ChartData } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";

// Fixed categorical order (never cycled); per-theme values live in globals.css (--chart-*).
const SERIES_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const W = 640;
const H = 280;
const M = { top: 16, right: 20, bottom: 40, left: 56 };

function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const raw = (max - min) / count;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  const step = (n >= 7.5 ? 10 : n >= 3.5 ? 5 : n >= 1.5 ? 2 : 1) * pow;
  const ticks: number[] = [];
  for (let v = Math.floor(min / step) * step; v <= Math.ceil(max / step) * step + step / 2; v += step) {
    ticks.push(Number(v.toPrecision(12)));
  }
  return ticks;
}

/**
 * Line chart for real, supplied results (e.g. forecast vs. observed).
 * Crosshair + tooltip on hover and keyboard, legend for ≥2 series,
 * and a data table so no value is hover-only.
 */
export function MetricChart({ chart }: { chart: ChartData }) {
  const { l, t, locale } = useI18n();
  const titleId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const format = useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }), [locale]);

  const model = useMemo(() => {
    const series = chart.series.map((s) => ({ ...s, points: [...s.points].sort((a, b) => a[0] - b[0]) }));
    const xs = Array.from(new Set(series.flatMap((s) => s.points.map((p) => p[0])))).sort((a, b) => a - b);
    const ys = series.flatMap((s) => s.points.map((p) => p[1]));
    const yMinRaw = Math.min(...ys);
    const yTicks = niceTicks(yMinRaw >= 0 ? 0 : yMinRaw, Math.max(...ys));
    const y0 = yTicks[0]!;
    const y1 = yTicks[yTicks.length - 1]!;
    const x0 = xs[0] ?? 0;
    const x1 = xs[xs.length - 1] ?? 1;
    const sx = (x: number) => M.left + ((x - x0) / (x1 - x0 || 1)) * (W - M.left - M.right);
    const sy = (y: number) => H - M.bottom - ((y - y0) / (y1 - y0 || 1)) * (H - M.top - M.bottom);
    const xTicks = xs.length <= 8 ? xs : niceTicks(x0, x1, 6).filter((v) => v >= x0 && v <= x1);
    return { series, xs, yTicks, xTicks, sx, sy };
  }, [chart]);

  if (model.xs.length === 0) return null;
  const { series, xs, yTicks, xTicks, sx, sy } = model;
  const activeX = active !== null ? xs[active] : undefined;

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * W;
    let best = 0;
    xs.forEach((value, i) => {
      if (Math.abs(sx(value) - x) < Math.abs(sx(xs[best]!) - x)) best = i;
    });
    setActive(best);
  };

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === "ArrowRight") setActive((i) => Math.min(xs.length - 1, (i ?? -1) + 1));
    else if (event.key === "ArrowLeft") setActive((i) => Math.max(0, (i ?? 1) - 1));
    else return;
    event.preventDefault();
  };

  const tooltipLeft = activeX !== undefined ? (sx(activeX) / W) * 100 : 0;

  return (
    <figure className="rounded-lg border border-line bg-surface p-4">
      <figcaption id={titleId} className="text-sm font-semibold text-fg">
        {l(chart.title)}
      </figcaption>

      {series.length >= 2 && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {series.map((s, i) => (
            <li key={s.name} className="inline-flex items-center gap-2">
              <span className="h-0.5 w-4 rounded-full" style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }} />
              {s.name}
            </li>
          ))}
        </ul>
      )}

      <div className="relative mt-3">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
          role="group"
          aria-labelledby={titleId}
          tabIndex={0}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive((i) => i ?? 0)}
          onBlur={() => setActive(null)}
          onKeyDown={onKeyDown}
        >
          {yTicks.map((tick) => (
            <g key={tick}>
              <line x1={M.left} x2={W - M.right} y1={sy(tick)} y2={sy(tick)} strokeWidth="1" style={{ stroke: "var(--line)" }} />
              <text x={M.left - 8} y={sy(tick) + 4} textAnchor="end" className="font-mono tabular-nums" style={{ fill: "var(--subtle)", fontSize: 11 }}>
                {format.format(tick)}
              </text>
            </g>
          ))}
          {xTicks.map((tick) => (
            <text key={tick} x={sx(tick)} y={H - M.bottom + 18} textAnchor="middle" className="font-mono tabular-nums" style={{ fill: "var(--subtle)", fontSize: 11 }}>
              {format.format(tick)}
            </text>
          ))}
          <text x={W - M.right} y={H - 6} textAnchor="end" style={{ fill: "var(--muted)", fontSize: 11 }}>
            {l(chart.xLabel)}
          </text>
          <text x={M.left} y={10} textAnchor="start" style={{ fill: "var(--muted)", fontSize: 11 }}>
            {l(chart.yLabel)}
          </text>

          {series.map((s, i) => (
            <path
              key={s.name}
              d={s.points.map(([x, y], j) => `${j === 0 ? "M" : "L"}${sx(x)} ${sy(y)}`).join(" ")}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ stroke: SERIES_COLORS[i % SERIES_COLORS.length] }}
            />
          ))}

          {activeX !== undefined && (
            <g>
              <line x1={sx(activeX)} x2={sx(activeX)} y1={M.top} y2={H - M.bottom} strokeWidth="1" style={{ stroke: "var(--line-strong)" }} />
              {series.map((s, i) => {
                const point = s.points.find((p) => p[0] === activeX);
                if (!point) return null;
                return (
                  <circle
                    key={s.name}
                    cx={sx(point[0])}
                    cy={sy(point[1])}
                    r="4.5"
                    strokeWidth="2"
                    style={{ fill: SERIES_COLORS[i % SERIES_COLORS.length], stroke: "var(--surface)" }}
                  />
                );
              })}
            </g>
          )}
        </svg>

        {activeX !== undefined && (
          <div
            aria-live="polite"
            className="pointer-events-none absolute top-2 z-10 min-w-36 rounded-md border border-line-strong bg-bg-elevated px-3 py-2 text-xs shadow-card"
            style={{
              left: `${tooltipLeft}%`,
              transform: `translateX(${tooltipLeft > 65 ? "calc(-100% - 12px)" : "12px"})`,
            }}
          >
            <p className="font-mono text-subtle">
              {l(chart.xLabel)}: {format.format(activeX)}
            </p>
            <ul className="mt-1 space-y-0.5">
              {series.map((s, i) => {
                const point = s.points.find((p) => p[0] === activeX);
                if (!point) return null;
                return (
                  <li key={s.name} className="flex items-center gap-2">
                    <span className="h-0.5 w-3 rounded-full" style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }} />
                    <strong className="font-semibold tabular-nums text-fg">{format.format(point[1])}</strong>
                    <span className="text-muted">{s.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-mono text-xs text-muted hover:text-fg">{t.common.dataTable}</summary>
        <div className="scroll-thin mt-2 max-h-64 overflow-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-line text-muted">
                <th scope="col" className="py-1.5 pr-4 font-medium">
                  {l(chart.xLabel)}
                </th>
                {series.map((s) => (
                  <th key={s.name} scope="col" className="py-1.5 pr-4 font-medium">
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {xs.map((x) => (
                <tr key={x} className="border-b border-line/60">
                  <th scope="row" className="py-1 pr-4 font-normal text-muted">
                    {format.format(x)}
                  </th>
                  {series.map((s) => {
                    const point = s.points.find((p) => p[0] === x);
                    return (
                      <td key={s.name} className="py-1 pr-4 text-fg">
                        {point ? format.format(point[1]) : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
