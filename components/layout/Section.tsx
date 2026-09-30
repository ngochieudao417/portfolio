import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Reveal } from "./Reveal";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Compact sections (e.g. Beyond Tech) get less vertical space. */
  size?: "default" | "compact";
}

export function Section({ id, children, className, size = "default" }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
      className={cn(
        "relative outline-none",
        size === "default" ? "py-20 md:py-28 recruiter:py-12 md:recruiter:py-16" : "py-14 md:py-20 recruiter:py-10",
        className,
      )}
    >
      <div className="container-lab">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  size?: "default" | "compact";
  children?: ReactNode;
}

/** `[02] ABOUT ─────` metadata rule, heading and optional lede. */
export function SectionHeader({ id, index, eyebrow, title, description, size = "default", children }: SectionHeaderProps) {
  return (
    <Reveal className={size === "default" ? "mb-10 md:mb-14 recruiter:mb-8" : "mb-8"}>
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
        <span className="text-accent">[{index}]</span>
        <span>{eyebrow}</span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </p>
      <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <h2
            id={`${id}-title`}
            className={cn(
              "font-display font-semibold tracking-tight text-fg",
              size === "default" ? "text-[1.75rem] leading-tight sm:text-4xl md:text-[2.75rem]" : "text-2xl sm:text-3xl",
            )}
          >
            {title}
          </h2>
          {description && <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">{description}</p>}
        </div>
        {children}
      </div>
    </Reveal>
  );
}
