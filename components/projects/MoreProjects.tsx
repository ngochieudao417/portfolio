"use client";

import { Reveal } from "@/components/layout/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Pending } from "@/components/ui/Pending";
import { DomainLabel, TagList } from "@/components/ui/Tag";
import { moreProjects } from "@/content/projects";
import { site } from "@/content/site";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { accentStyle } from "@/lib/utils/domains";

/** Smaller builds, experiments and prototypes (non-featured projects). */
export function MoreProjects({ onOpen }: { onOpen: (slug: string) => void }) {
  const { t, l } = useI18n();
  // Nothing to show yet: hide the block entirely in production (dev keeps the TODO marker).
  if (moreProjects.length === 0 && !site.showPlaceholders) return null;

  return (
    <Reveal className="mt-16">
      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-fg">{t.projects.moreTitle}</h3>
        <p className="hidden text-sm text-muted sm:block">{t.projects.moreDescription}</p>
      </div>

      {moreProjects.length === 0 ? (
        <Pending className="mt-4" what="smaller projects (featured: false)" where="content/projects.ts — template at the bottom" />
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {moreProjects.map((project) => (
            <li key={project.slug} style={accentStyle(project.accent)} className="relative">
              <div className="flex h-full flex-col rounded-lg border border-line bg-surface p-4 transition-colors hover:border-line-strong">
                <div className="flex items-center justify-between gap-2">
                  <DomainLabel>{l(project.category)}</DomainLabel>
                  {project.year && <span className="font-mono text-xs text-subtle">{project.year}</span>}
                </div>
                <h4 className="mt-2 font-display text-base font-semibold text-fg">
                  {project.caseStudy.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => onOpen(project.slug)}
                      aria-haspopup="dialog"
                      className="text-left after:absolute after:inset-0 after:content-['']"
                    >
                      {project.title}
                    </button>
                  ) : project.links.github || project.links.demo ? (
                    <a
                      href={project.links.demo || project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 after:absolute after:inset-0 after:content-['']"
                    >
                      {project.title}
                      <Icon name="arrowUpRight" size={14} className="text-subtle" />
                      <span className="sr-only">{t.common.newTab}</span>
                    </a>
                  ) : (
                    project.title
                  )}
                </h4>
                <p className="mt-1.5 flex-1 text-sm text-muted">{l(project.summary)}</p>
                <TagList tags={project.tags} limit={4} className="mt-3" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}
