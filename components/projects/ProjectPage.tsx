"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { featuredProjects, getProject } from "@/content/projects";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { ProjectCaseStudy } from "./ProjectCaseStudy";

/** Standalone /projects/[slug] view — same case study as the modal, plus prev/next. */
export function ProjectPage({ slug }: { slug: string }) {
  const { t } = useI18n();
  const project = getProject(slug);
  if (!project) return null;

  const index = featuredProjects.findIndex((p) => p.slug === slug);
  const previous = index > 0 ? featuredProjects[index - 1] : undefined;
  const next = index >= 0 && index < featuredProjects.length - 1 ? featuredProjects[index + 1] : undefined;

  return (
    <div className="container-lab pb-20 pt-28 md:pt-32">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-fg"
        >
          <Icon name="arrowLeft" size={15} />
          {t.common.back}
        </Link>

        <div className="mt-10">
          <ProjectCaseStudy project={project} titleId="project-title" variant="page" />
        </div>

        {(previous || next) && (
          <nav aria-label={t.nav.projects} className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
            {previous ? (
              <Link href={`/projects/${previous.slug}`} className="group rounded-lg border border-line p-4 transition-colors hover:border-line-strong">
                <span className="flex items-center gap-2 font-mono text-xs text-subtle">
                  <Icon name="arrowLeft" size={13} />
                  {t.projects.previousProject}
                </span>
                <span className="mt-1 block font-display font-semibold text-fg">{previous.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/projects/${next.slug}`}
                className="group rounded-lg border border-line p-4 text-right transition-colors hover:border-line-strong"
              >
                <span className="flex items-center justify-end gap-2 font-mono text-xs text-subtle">
                  {t.projects.nextProject}
                  <Icon name="arrowRight" size={13} />
                </span>
                <span className="mt-1 block font-display font-semibold text-fg">{next.title}</span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
