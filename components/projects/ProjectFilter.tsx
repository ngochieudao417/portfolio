"use client";

import { motion } from "framer-motion";
import { featuredProjects, projects, projectsInDomain } from "@/content/projects";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { ProjectFilter as Filter } from "@/lib/ui-state";
import { cn } from "@/lib/utils/cn";
import { DOMAINS, domainColor } from "@/lib/utils/domains";

/** Subtle, fast category filter. Default view = featured. */
export function ProjectFilter({ value, onChange }: { value: Filter; onChange: (next: Filter) => void }) {
  const { t } = useI18n();

  const options: Array<{ id: Filter; label: string; count: number; color?: string }> = [
    { id: "featured", label: t.projects.featured, count: featuredProjects.length },
    { id: "all", label: t.projects.all, count: projects.length },
    ...DOMAINS.map((domain) => ({
      id: domain,
      label: t.domains[domain],
      count: projectsInDomain(domain).length,
      color: domainColor(domain),
    })),
  ];

  return (
    <div
      role="group"
      aria-label={t.projects.filterLabel}
      className="scroll-thin -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 font-mono text-[0.8125rem] transition-colors",
              active ? "text-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
            )}
          >
            {active && (
              <motion.span
                layoutId="project-filter"
                className="absolute inset-0 rounded-lg border border-line-strong bg-surface"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            {option.color && (
              <span className="relative size-1.5 rounded-full" style={{ background: option.color }} aria-hidden="true" />
            )}
            <span className="relative">{option.label}</span>
            <span className="relative text-[0.6875rem] text-subtle">{option.count}</span>
          </button>
        );
      })}
    </div>
  );
}
