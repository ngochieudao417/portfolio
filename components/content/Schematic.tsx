import { useId, type CSSProperties } from "react";
import type { Domain, Schematic as SchematicData } from "@/content/types";
import { cn } from "@/lib/utils/cn";
import { accentStyle } from "@/lib/utils/domains";

const W = 480;
const H = 270;
const PAD = 28;

/** Trig results can differ in the last float digit between Node and browsers — round for stable SSR. */
const r = (value: number) => Math.round(value * 100) / 100;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

interface Edge {
  d: string;
  arrow: boolean;
}

function node(cx: number, cy: number, w: number, h: number, label: string): Box {
  return { x: r(cx - w / 2), y: r(cy - h / 2), w: r(w), h: r(h), label };
}

function straight(a: Box, b: Box): Edge {
  // Horizontal neighbours connect side to side; stacked ones connect top/bottom.
  if (Math.abs(a.y - b.y) < 1) {
    const forward = b.x > a.x;
    const y = a.y + a.h / 2;
    const x1 = forward ? a.x + a.w : a.x;
    const x2 = forward ? b.x - 4 : b.x + b.w + 4;
    return { d: `M${x1} ${y} L${x2} ${y}`, arrow: true };
  }
  const x = a.x + a.w / 2;
  return { d: `M${x} ${a.y + a.h} L${x} ${b.y - 4}`, arrow: true };
}

function layout(data: SchematicData): { boxes: Box[]; edges: Edge[]; chevrons: string[] } {
  const n = data.nodes.length;
  const boxes: Box[] = [];
  const edges: Edge[] = [];
  const chevrons: string[] = [];

  if (data.layout === "snake") {
    const perRow = Math.ceil(n / 2);
    const gap = 28;
    const w = Math.min(112, (W - PAD * 2 - gap * (perRow - 1)) / perRow);
    data.nodes.forEach((label, i) => {
      const row = i < perRow ? 0 : 1;
      const col = row === 0 ? i : perRow - 1 - (i - perRow);
      boxes.push(node(PAD + w / 2 + col * (w + gap), row === 0 ? 92 : 182, w, 38, label));
    });
  } else if (data.layout === "loop") {
    const cx = W / 2;
    const cy = H / 2;
    const rx = 165;
    const ry = 84;
    const angles = data.nodes.map((_, i) => -Math.PI / 2 + (i * Math.PI * 2) / n);
    data.nodes.forEach((label, i) => {
      const a = angles[i]!;
      boxes.push(node(cx + rx * Math.cos(a), cy + ry * Math.sin(a), 116, 34, label));
    });
    angles.forEach((a, i) => {
      const b = i === n - 1 ? angles[0]! + Math.PI * 2 : angles[i + 1]!;
      const from = { x: r(cx + rx * Math.cos(a)), y: r(cy + ry * Math.sin(a)) };
      const to = { x: r(cx + rx * Math.cos(b)), y: r(cy + ry * Math.sin(b)) };
      edges.push({ d: `M${from.x} ${from.y} A${rx} ${ry} 0 0 1 ${to.x} ${to.y}`, arrow: false });
      // Direction chevron at the arc midpoint, oriented along the tangent.
      const m = (a + b) / 2;
      const px = r(cx + rx * Math.cos(m));
      const py = r(cy + ry * Math.sin(m));
      const angle = r((Math.atan2(ry * Math.cos(m), -rx * Math.sin(m)) * 180) / Math.PI);
      chevrons.push(`translate(${px} ${py}) rotate(${angle})`);
    });
    return { boxes, edges, chevrons };
  } else if (data.layout === "branch" && n >= 3) {
    const w = 104;
    const first = node(PAD + w / 2, H / 2, w, 38, data.nodes[0]!);
    const last = node(W - PAD - w / 2, H / 2, w, 38, data.nodes[n - 1]!);
    const middle = data.nodes.slice(1, -1);
    const spacing = 76;
    const top = H / 2 - ((middle.length - 1) * spacing) / 2;
    boxes.push(first);
    middle.forEach((label, i) => boxes.push(node(W / 2, top + i * spacing, w, 38, label)));
    boxes.push(last);
    const mids = boxes.slice(1, -1);
    for (const mid of mids) {
      const a = { x: first.x + first.w, y: first.y + first.h / 2 };
      const b = { x: mid.x - 4, y: mid.y + mid.h / 2 };
      edges.push({ d: `M${a.x} ${a.y} C${a.x + 40} ${a.y} ${b.x - 40} ${b.y} ${b.x} ${b.y}`, arrow: true });
      const c = { x: mid.x + mid.w, y: mid.y + mid.h / 2 };
      const e = { x: last.x - 4, y: last.y + last.h / 2 };
      edges.push({ d: `M${c.x} ${c.y} C${c.x + 40} ${c.y} ${e.x - 40} ${e.y} ${e.x} ${e.y}`, arrow: true });
    }
    return { boxes, edges, chevrons };
  } else {
    const gap = 24;
    const w = Math.min(104, (W - PAD * 2 - gap * (n - 1)) / n);
    data.nodes.forEach((label, i) => boxes.push(node(PAD + w / 2 + i * (w + gap), H / 2, w, 38, label)));
  }

  for (let i = 0; i < boxes.length - 1; i++) edges.push(straight(boxes[i]!, boxes[i + 1]!));
  return { boxes, edges, chevrons };
}

interface SchematicProps {
  data: SchematicData;
  accent: Domain;
  /** Accessible description of what the drawing shows. */
  label: string;
  caption?: string;
  /** Keep the data-flow animation running (otherwise it runs on card hover). */
  live?: boolean;
  className?: string;
}

/**
 * Abstract pipeline drawing (SVG) used as the project visual until real
 * screenshots exist, and as the architecture sketch in case studies.
 */
export function Schematic({ data, accent, label, caption, live = false, className }: SchematicProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { boxes, edges, chevrons } = layout(data);
  const style = { ...accentStyle(accent) } as CSSProperties;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
      className={cn("h-full w-full", live && "flow-live", className)}
      style={style}
    >
      <defs>
        <pattern id={`dots-${id}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" style={{ fill: "var(--line-strong)" }} />
        </pattern>
        <marker
          id={`arrow-${id}`}
          viewBox="0 0 8 8"
          refX="6"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L8 4 L0 8 z" style={{ fill: "var(--subtle)" }} />
        </marker>
      </defs>

      <rect width={W} height={H} fill={`url(#dots-${id})`} opacity="0.6" />

      {caption && (
        <text x="14" y="22" className="font-mono" style={{ fill: "var(--subtle)", fontSize: 10, letterSpacing: "0.12em" }}>
          {caption}
        </text>
      )}

      <g fill="none" strokeLinecap="round">
        {edges.map((edge, i) => (
          <g key={i}>
            <path
              d={edge.d}
              style={{ stroke: "var(--line-strong)" }}
              strokeWidth="1.5"
              markerEnd={edge.arrow ? `url(#arrow-${id})` : undefined}
            />
            <path d={edge.d} className="flow-path" style={{ stroke: "var(--accent)" }} strokeWidth="1.5" />
          </g>
        ))}
      </g>

      {chevrons.map((transform, i) => (
        <path
          key={i}
          d="M-4 -4 L2 0 L-4 4"
          transform={transform}
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ stroke: "var(--subtle)" }}
        />
      ))}

      {data.layout === "loop" && data.center && (
        <text
          x={W / 2}
          y={H / 2 + 8}
          textAnchor="middle"
          className="font-mono"
          style={{ fill: "var(--accent)", fontSize: 26, fontWeight: 600 }}
        >
          {data.center}
        </text>
      )}

      {boxes.map((box, i) => {
        const edge = i === 0 || i === boxes.length - 1;
        return (
          <g key={box.label + i}>
            <rect
              x={box.x}
              y={box.y}
              width={box.w}
              height={box.h}
              rx="6"
              strokeWidth={edge ? 1.5 : 1}
              style={{ fill: "var(--surface)", stroke: edge ? "var(--accent)" : "var(--line-strong)" }}
            />
            <text
              x={box.x + box.w / 2}
              y={box.y + box.h / 2 + 4}
              textAnchor="middle"
              className="font-mono"
              style={{ fill: edge ? "var(--fg)" : "var(--muted)", fontSize: 12 }}
            >
              {box.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
