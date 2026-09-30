"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/layout/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Pending } from "@/components/ui/Pending";
import { TagList } from "@/components/ui/Tag";
import { ZoomableImage } from "@/components/ui/ZoomableImage";
import { getProject } from "@/content/projects";
import { site } from "@/content/site";
import type { JourneyItem, JourneyType } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { accentStyle } from "@/lib/utils/domains";

const TYPE_ICONS: Record<JourneyType, IconName> = {
  education: "cap",
  work: "briefcase",
  research: "flask",
  award: "trophy",
};

interface TimelineItemProps {
  item: JourneyItem;
  open: boolean;
  onToggle: () => void;
  delay?: number;
}

export function TimelineItem({ item, open, onToggle, delay = 0 }: TimelineItemProps) {
  const { t, l } = useI18n();
  const panelId = `journey-${item.id}`;
  const related = (item.relatedProjects ?? []).map(getProject).filter((p) => p !== undefined);
  const responsibilities = item.responsibilities ? l(item.responsibilities) : [];
  const achievements = item.achievements ? l(item.achievements) : [];
  const technologies = item.technologies ?? [];
  const hasDetails =
    responsibilities.length + achievements.length + technologies.length + related.length > 0 ||
    Boolean(item.image || item.link);
  const missing = [
    !item.period && "period",
    responsibilities.length === 0 && (item.type === "work" || item.type === "research") && "responsibilities",
  ].filter(Boolean);
  // Milestones with nothing more to say stay static — no empty panel to open.
  const expandable = hasDetails || (site.showPlaceholders && missing.length > 0);

  const header = (
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-subtle">
        {item.period && <span className="text-muted">{item.period}</span>}
        <span className="uppercase tracking-[0.14em]">{t.journey.types[item.type]}</span>
      </span>
      <span className="mt-1.5 block font-display text-lg font-semibold tracking-tight text-fg">{l(item.role)}</span>
      <span className="block text-sm text-muted">
        {item.org}
        {item.summary && <span className="text-subtle"> · {l(item.summary)}</span>}
      </span>
    </span>
  );

  return (
    <Reveal as="li" delay={delay} style={accentStyle(item.domains[0])} className="relative pl-12 sm:pl-16">
      <span
        aria-hidden="true"
        className="absolute left-0 top-3 grid size-9 place-items-center rounded-full border border-line-strong bg-bg text-accent sm:left-2"
      >
        <Icon name={TYPE_ICONS[item.type]} size={15} />
      </span>

      <div className="rounded-xl border border-line bg-surface transition-colors hover:border-line-strong">
        {expandable ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
            className="flex w-full items-start gap-4 px-4 py-4 text-left sm:px-5"
          >
            {header}
            <span className="mt-1 flex shrink-0 items-center gap-1.5 font-mono text-xs text-subtle">
              <span className="sr-only sm:not-sr-only">{open ? t.journey.collapse : t.journey.expand}</span>
              <Icon name="chevronDown" size={16} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
            </span>
          </button>
        ) : (
          <div className="flex items-start gap-4 px-4 py-4 sm:px-5">{header}</div>
        )}

        <AnimatePresence initial={false}>
          {open && expandable && (
            <motion.div
              id={panelId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-4 border-t border-line px-4 py-4 sm:px-5">
                {item.image && (
                  <ZoomableImage
                    image={item.image}
                    className="aspect-[16/10] max-w-xl"
                    sizes="(min-width: 768px) 576px, 90vw"
                  />
                )}
                {responsibilities.length > 0 && (
                  <Detail title={t.journey.responsibilities}>
                    <Bullets items={responsibilities} />
                  </Detail>
                )}
                {achievements.length > 0 && (
                  <Detail title={t.journey.achievements}>
                    <Bullets items={achievements} />
                  </Detail>
                )}
                {technologies.length > 0 && (
                  <Detail title={t.journey.technologies}>
                    <TagList tags={technologies} />
                  </Detail>
                )}
                {related.length > 0 && (
                  <Detail title={t.journey.relatedProjects}>
                    <ul className="flex flex-wrap gap-2">
                      {related.map((project) => (
                        <li key={project.slug}>
                          <Link
                            href={`/projects/${project.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 font-mono text-xs text-fg transition-colors hover:border-accent hover:text-accent"
                          >
                            {project.title}
                            <Icon name="arrowRight" size={12} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Detail>
                )}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-sm text-accent hover:underline"
                  >
                    {t.common.article}
                    <Icon name="arrowUpRight" size={14} />
                    <span className="sr-only">{t.common.newTab}</span>
                  </a>
                )}
                {missing.length > 0 && (
                  <Pending what={`${missing.join(", ")} for ${item.org}`} where="content/journey.ts" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

function Detail({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">{title}</h4>
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((text) => (
        <li key={text} className="flex gap-3 text-sm leading-relaxed text-fg/90">
          <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
          {text}
        </li>
      ))}
    </ul>
  );
}
