"use client";

import { useState } from "react";
import { Reveal } from "@/components/layout/Reveal";
import { Section, SectionHeader } from "@/components/layout/Section";
import { research } from "@/content/research";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { ResearchCard } from "./ResearchCard";

export function ResearchLab() {
  const { t } = useI18n();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Section id="research" className="border-y border-line bg-bg-elevated/60 [--accent:var(--accent-research)]">
      <div aria-hidden="true" className="lab-grid lab-grid-fade pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative">
        <SectionHeader
          id="research"
          index="03"
          eyebrow={t.research.eyebrow}
          title={t.research.title}
          description={t.research.description}
        />
        <div className="space-y-5">
          {research.map((entry, index) => (
            <Reveal key={entry.slug} delay={index * 0.06}>
              <ResearchCard
                entry={entry}
                open={open === entry.slug}
                onToggle={() => setOpen((current) => (current === entry.slug ? null : entry.slug))}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
