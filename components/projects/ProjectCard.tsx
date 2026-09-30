"use client";

import { motion } from "framer-motion";
import type { PointerEvent } from "react";
import { DomainLabel, TagList } from "@/components/ui/Tag";
import { Icon } from "@/components/ui/Icon";
import type { Project } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { accentStyle } from "@/lib/utils/domains";
import { ProjectPreview } from "./ProjectPreview";

function trackSpotlight(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

/** Award / recognition line, e.g. "First Prize · SEA Quantathon 2026". */
export function HighlightChip({ text, className }: { text: string; className?: string }) {
  return (
    <p
      className={`inline-flex w-fit items-center gap-1.5 rounded-md border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-2 py-0.5 font-mono text-xs text-fg ${className ?? ""}`}
    >
      <Icon name="trophy" size={13} className="text-accent" />
      {text}
    </p>
  );
}

/** Featured project card: visual preview → click opens the case study. */
export function ProjectCard({ project, onOpen }: { project: Project; onOpen: (slug: string) => void }) {
  const { t, l } = useI18n();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={accentStyle(project.accent)}
      onPointerMove={trackSpotlight}
      className="spotlight group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--accent)_45%,transparent)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-surface-2/60">
        <ProjectPreview project={project} />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <DomainLabel>{l(project.category)}</DomainLabel>
          {project.index && <span className="font-mono text-xs text-subtle">{project.index}</span>}
        </div>

        {project.highlight && <HighlightChip text={l(project.highlight)} className="mt-3" />}

        <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-fg sm:text-[1.375rem]">
          <button
            type="button"
            onClick={() => onOpen(project.slug)}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-xl focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-[color:var(--focus)]"
          >
            {project.title}
          </button>
        </h3>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{l(project.summary)}</p>

        <TagList tags={project.tags} limit={5} className="mt-4" />

        <span className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-sm text-accent">
          {t.projects.viewCaseStudy}
          <Icon name="arrowRight" size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </motion.article>
  );
}

/** Recruiter-mode row: the same project, scannable in one line. */
export function ProjectRow({ project, onOpen }: { project: Project; onOpen: (slug: string) => void }) {
  const { t, l } = useI18n();
  return (
    <li style={accentStyle(project.accent)} className="relative">
      <div className="grid gap-2 rounded-lg border border-line bg-surface px-4 py-4 transition-colors hover:border-line-strong md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] md:items-center md:gap-6">
        <div>
          <DomainLabel>{l(project.category)}</DomainLabel>
          <h3 className="mt-1 font-display text-base font-semibold text-fg">
            <button
              type="button"
              onClick={() => onOpen(project.slug)}
              aria-haspopup="dialog"
              className="text-left after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </button>
          </h3>
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted">{l(project.summary)}</p>
          <p className="mt-1.5 truncate font-mono text-xs text-subtle">{project.tags.join(" · ")}</p>
          {project.highlight && <HighlightChip text={l(project.highlight)} className="mt-2" />}
        </div>
        <span className="hidden items-center gap-1.5 font-mono text-xs text-accent md:inline-flex">
          {t.projects.caseStudy}
          <Icon name="arrowRight" size={13} />
        </span>
      </div>
    </li>
  );
}
