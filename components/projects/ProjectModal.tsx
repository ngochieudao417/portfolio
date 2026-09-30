"use client";

import { useId, useRef } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { getProject } from "@/content/projects";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { ProjectCaseStudy } from "./ProjectCaseStudy";

/** Immersive, keyboard-accessible case-study modal. Loaded on first open. */
export default function ProjectModal({ slug, onClose }: { slug: string | null; onClose: () => void }) {
  const { t } = useI18n();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  // Keep the last project rendered while the exit animation plays.
  const lastSlug = useRef(slug);
  if (slug) lastSlug.current = slug;
  const project = lastSlug.current ? getProject(lastSlug.current) : undefined;

  return (
    <Dialog
      open={Boolean(slug && project)}
      onClose={onClose}
      labelledBy={titleId}
      initialFocus={closeRef}
      className="flex max-h-[100dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-line-strong bg-bg shadow-card sm:max-h-[92vh] sm:rounded-2xl"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">{t.projects.caseStudy}</span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.common.close}
          className="grid size-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:text-fg"
        >
          <Icon name="close" size={17} />
        </button>
      </div>
      <div className="scroll-thin flex-1 overflow-y-auto overscroll-contain px-5 py-8 sm:px-10 sm:py-10">
        {project && <ProjectCaseStudy project={project} titleId={titleId} variant="modal" />}
      </div>
    </Dialog>
  );
}
