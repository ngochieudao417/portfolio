"use client";

import Link from "next/link";
import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { Icon } from "@/components/ui/Icon";
import { DomainLabel } from "@/components/ui/Tag";
import { getProject } from "@/content/projects";
import { getResearch } from "@/content/research";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { accentStyle } from "@/lib/utils/domains";
import { ResearchDeepDive } from "./ResearchDeepDive";

/** Standalone /research/[slug]: overview on top, notebook open below. */
export function ResearchPage({ slug }: { slug: string }) {
  const { t, l } = useI18n();
  const entry = getResearch(slug);
  if (!entry) return null;
  const project = entry.project ? getProject(entry.project) : undefined;

  const meta = [
    { label: t.research.role, value: entry.role },
    { label: t.research.status, value: entry.status },
    { label: t.research.venue, value: entry.venue },
    { label: t.research.keyResult, value: entry.keyResult },
  ].filter((item) => item.value);

  return (
    <div style={accentStyle(entry.accent)} className="container-lab pb-20 pt-28 md:pt-32">
      <div className="mx-auto max-w-4xl">
        <Link href="/#research" className="inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-fg">
          <Icon name="arrowLeft" size={15} />
          {t.common.back}
        </Link>

        <header className="mt-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="rounded-md border border-accent/50 px-2 py-0.5 font-mono text-xs text-accent">{entry.code}</span>
            <DomainLabel>{entry.domains.map((domain) => t.domains[domain]).join(" / ")}</DomainLabel>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-fg sm:text-4xl md:text-[2.75rem]">
            {l(entry.title)}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">{l(entry.abstract)}</p>

          {meta.length > 0 && (
            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              {meta.map((item) => (
                <div key={item.label} className="rounded-lg border border-line bg-surface p-4">
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">{item.label}</dt>
                  <dd className="mt-1 text-sm text-fg">{item.value && l(item.value)}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ProjectLinks links={entry.links} source="content/research.ts" expected={entry.links.article ? [] : ["paper", "repo"]} />
            {project && (
              <Link
                href={`/projects/${project.slug}`}
                className="inline-flex items-center gap-1.5 font-mono text-sm text-accent hover:underline"
              >
                {t.projects.caseStudy}: {project.title}
                <Icon name="arrowRight" size={14} />
              </Link>
            )}
          </div>
        </header>

        <div className="mt-12">
          <ResearchDeepDive entry={entry} />
        </div>
      </div>
    </div>
  );
}
