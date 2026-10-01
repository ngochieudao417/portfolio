"use client";

import { motion } from "framer-motion";
import { useCalmMode } from "@/components/recruiter-mode/RecruiterModeProvider";
import { cn } from "@/lib/utils/cn";

/** Labelled progress bar (0–100). The fill grows in once when scrolled into view. */
export function ProgressBar({ value, label, className }: { value: number; label: string; className?: string }) {
  const calm = useCalmMode();
  const pct = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-baseline justify-between gap-3 font-mono text-xs">
        <span className="text-fg">{label}</span>
        <span className="tabular-nums text-muted">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line"
      >
        <motion.div
          className="h-full origin-left rounded-full bg-accent"
          style={{ width: `${pct}%` }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={calm ? { duration: 0 } : { duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
