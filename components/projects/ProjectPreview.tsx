"use client";

import Image from "next/image";
import { Schematic } from "@/components/content/Schematic";
import { useAsset } from "@/components/layout/AssetsProvider";
import type { Project } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";

/** Cover image when supplied; otherwise the project's pipeline schematic. */
export function ProjectPreview({ project, sizes }: { project: Project; sizes?: string }) {
  const { l } = useI18n();
  const cover = useAsset(project.cover?.src);

  if (cover && project.cover) {
    return (
      <Image
        src={cover}
        alt={l(project.cover.alt)}
        fill
        sizes={sizes ?? "(min-width: 1024px) 560px, 100vw"}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
    );
  }

  return (
    <Schematic
      data={project.schematic}
      accent={project.accent}
      label={`${project.title} — ${project.schematic.nodes.join(" → ")}`}
      caption={project.index ? `FIG. P${project.index}` : undefined}
    />
  );
}
