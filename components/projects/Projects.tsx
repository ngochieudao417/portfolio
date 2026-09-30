"use client";

import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Reveal } from "@/components/layout/Reveal";
import { Section, SectionHeader } from "@/components/layout/Section";
import { useRecruiterMode } from "@/components/recruiter-mode/RecruiterModeProvider";
import { featuredProjects, projects, projectsInDomain } from "@/content/projects";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { projectFilterStore } from "@/lib/ui-state";
import { useStore } from "@/lib/utils/store";
import { GitHubStrip } from "./GitHubStrip";
import { MoreProjects } from "./MoreProjects";
import { ProjectCard, ProjectRow } from "./ProjectCard";
import { ProjectFilter } from "./ProjectFilter";

// The case-study modal (and the research notebook inside it) loads on first open.
const ProjectModal = dynamic(() => import("./ProjectModal"), { ssr: false });

export function Projects() {
  const { t } = useI18n();
  const { enabled: recruiter } = useRecruiterMode();
  const filter = useStore(projectFilterStore);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [modalRequested, setModalRequested] = useState(false);

  const list =
    filter === "featured" ? featuredProjects : filter === "all" ? projects : projectsInDomain(filter);

  const open = (slug: string) => {
    setModalRequested(true);
    setOpenSlug(slug);
  };

  return (
    <Section id="projects">
      <SectionHeader
        id="projects"
        index="02"
        eyebrow={t.projects.eyebrow}
        title={t.projects.title}
        description={t.projects.description}
      />

      <Reveal className="mb-6">
        <ProjectFilter value={filter} onChange={projectFilterStore.set} />
      </Reveal>

      <p className="sr-only" aria-live="polite">
        {t.projects.showing(list.length)}
      </p>
      <div>
        {list.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-4 py-10 text-center font-mono text-sm text-muted">
            {t.projects.empty}
          </p>
        ) : recruiter ? (
          <ul className="space-y-2">
            {list.map((project) => (
              <ProjectRow key={project.slug} project={project} onOpen={open} />
            ))}
          </ul>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((project) => (
                <ProjectCard key={project.slug} project={project} onOpen={open} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {filter === "featured" && <MoreProjects onOpen={open} />}
      <GitHubStrip />

      {modalRequested && <ProjectModal slug={openSlug} onClose={() => setOpenSlug(null)} />}
    </Section>
  );
}
