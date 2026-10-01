"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ContentBlocks, type BlockContext } from "@/components/content/ContentBlocks";
import { Schematic } from "@/components/content/Schematic";
import { useAsset } from "@/components/layout/AssetsProvider";
import { ResearchDeepDive } from "@/components/research/ResearchDeepDive";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DomainLabel, TagList } from "@/components/ui/Tag";
import { getResearch } from "@/content/research";
import type { Project } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { accentStyle } from "@/lib/utils/domains";
import { HighlightChip } from "./ProjectCard";
import { ProjectLinks } from "./ProjectLinks";

interface ProjectCaseStudyProps {
  project: Project;
  titleId: string;
  /** "modal" shows an "Open full page" link; "page" is the standalone route. */
  variant: "modal" | "page";
}

/** Visual showcase → technical case study. Shared by the modal and /projects/[slug]. */
export function ProjectCaseStudy({ project, titleId, variant }: ProjectCaseStudyProps) {
  const { t, l } = useI18n();
  const [deepDive, setDeepDive] = useState(false);
  const cover = useAsset(project.cover?.src);
  const research = project.research ? getResearch(project.research) : undefined;
  const schematicLabel = `${project.title} — ${project.schematic.nodes.join(" → ")}`;
  const Heading = variant === "page" ? "h1" : "h2";

  const ctx: BlockContext = {
    accent: project.accent,
    schematic: project.schematic,
    schematicLabel,
    metrics: project.metrics,
    chart: project.chart,
    screenshots: project.screenshots,
    source: "content/projects.ts",
  };

  return (
    <article style={accentStyle(project.accent)}>
      <header>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <DomainLabel>{l(project.category)}</DomainLabel>
          {project.index && <span className="font-mono text-xs text-subtle">P{project.index}</span>}
          {project.year && <span className="font-mono text-xs text-subtle">{project.year}</span>}
        </div>
        <Heading
          id={titleId}
          className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl md:text-5xl"
        >
          {project.title}
        </Heading>
        <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">{l(project.summary)}</p>
        {project.highlight && <HighlightChip text={l(project.highlight)} className="mt-4" />}
        {project.progress && (
          <ProgressBar value={project.progress.value} label={l(project.progress.label)} className="mt-5 max-w-sm" />
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <ProjectLinks
            links={project.links}
            source="content/projects.ts"
            expected={project.research ? ["paper", "github"] : ["github", "demo"]}
          />
          {variant === "modal" && (
            <ButtonLink href={`/projects/${project.slug}`} variant="ghost" size="sm">
              {t.common.fullPage}
              <Icon name="arrowUpRight" size={14} />
            </ButtonLink>
          )}
        </div>
      </header>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border border-line bg-surface-2/60">
        {cover && project.cover ? (
          <Image src={cover} alt={l(project.cover.alt)} fill sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
        ) : (
          <Schematic data={project.schematic} accent={project.accent} label={schematicLabel} live caption={`FIG. P${project.index ?? ""}`} />
        )}
      </div>

      <div className="mt-12">
        <ContentBlocks blocks={project.caseStudy} ctx={ctx} variant="case" />
      </div>

      <section className="mt-12 grid gap-3 border-t border-line pt-8 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8" aria-label={t.common.techStack}>
        <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-fg">{t.common.techStack}</h3>
        <TagList tags={project.tags} />
      </section>

      {research && (
        <section className="mt-12 border-t border-line pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-fg">
                <span className="text-accent">▸</span> {t.projects.deepDive}
              </h3>
              <p className="mt-1 text-sm text-muted">{t.projects.deepDiveHint}</p>
            </div>
            <button
              type="button"
              onClick={() => setDeepDive((open) => !open)}
              aria-expanded={deepDive}
              aria-controls={`${titleId}-deep-dive`}
              className="inline-flex h-10 items-center gap-2 self-start rounded-lg border border-accent px-4 font-mono text-sm text-accent transition-colors hover:bg-accent hover:text-on-accent"
            >
              {deepDive ? t.projects.deepDiveHide : t.projects.deepDive}
              <Icon name="chevronDown" size={15} className={deepDive ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>
          </div>
          <AnimatePresence initial={false}>
            {deepDive && (
              <motion.div
                id={`${titleId}-deep-dive`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-6">
                  <ResearchDeepDive entry={research} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}
    </article>
  );
}
