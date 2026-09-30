"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Pending } from "@/components/ui/Pending";
import { DomainLabel } from "@/components/ui/Tag";
import type { Localized, ResearchEntry } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { accentStyle } from "@/lib/utils/domains";
import { ResearchDeepDive } from "./ResearchDeepDive";

interface ResearchCardProps {
  entry: ResearchEntry;
  open: boolean;
  onToggle: () => void;
}

/** Layer 1: the recruiter-readable overview. Layer 2 (notebook) expands below it. */
export function ResearchCard({ entry, open, onToggle }: ResearchCardProps) {
  const { t, l } = useI18n();
  const panelId = `notebook-${entry.slug}`;

  const meta: Array<{ label: string; value: Localized | null; field: string }> = [
    { label: t.research.role, value: entry.role, field: "role" },
    { label: t.research.status, value: entry.status, field: "status" },
    { label: t.research.venue, value: entry.venue, field: "venue" },
    { label: t.research.keyResult, value: entry.keyResult, field: "keyResult" },
  ];
  const known = meta.filter((item) => item.value);
  const missing = meta.filter((item) => !item.value);

  return (
    <article
      style={accentStyle(entry.accent)}
      className="overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-colors hover:border-line-strong"
    >
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-10">
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="rounded-md border border-accent/50 px-2 py-0.5 font-mono text-xs text-accent">{entry.code}</span>
            <DomainLabel>{entry.domains.map((domain) => t.domains[domain]).join(" / ")}</DomainLabel>
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold leading-snug tracking-tight text-fg sm:text-2xl">
            {l(entry.title)}
          </h3>
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">{l(entry.abstract)}</p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={open}
              aria-controls={panelId}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 font-mono text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
            >
              <Icon name="flask" size={16} />
              {open ? t.research.closeNotebook : t.research.openNotebook}
              <Icon name="chevronDown" size={15} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>
            <ButtonLink href={`/research/${entry.slug}`} variant="ghost" size="md">
              {t.common.fullPage}
              <Icon name="arrowUpRight" size={14} />
            </ButtonLink>
          </div>
          <div className="mt-3">
            <ProjectLinks links={entry.links} source="content/research.ts" expected={entry.links.article ? [] : ["paper", "repo"]} />
          </div>
        </div>

        <dl className="space-y-4 border-line lg:border-l lg:pl-8">
          <div>
            <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">{t.research.domain}</dt>
            <dd className="mt-1 text-sm text-fg">{entry.domains.map((domain) => t.domains[domain]).join(", ")}</dd>
          </div>
          {known.map((item) => (
            <div key={item.field}>
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">{item.label}</dt>
              <dd className="mt-1 text-sm text-fg">{item.value && l(item.value)}</dd>
            </div>
          ))}
          {missing.length > 0 && (
            <Pending what={missing.map((item) => item.field).join(", ")} where={`content/research.ts (${entry.slug})`} />
          )}
        </dl>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line"
          >
            <div className="p-3 sm:p-5">
              <ResearchDeepDive entry={entry} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
