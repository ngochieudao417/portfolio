"use client";

import { Reveal } from "@/components/layout/Reveal";
import { Section, SectionHeader } from "@/components/layout/Section";
import { focusAreas } from "@/content/focus";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { FocusCard } from "./FocusCard";

/** About (a five-step story) + Current Focus. */
export function About() {
  const { t } = useI18n();

  return (
    <Section id="about">
      <SectionHeader id="about" index="01" eyebrow={t.about.eyebrow} title={t.about.title} />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <ol className="relative space-y-7 before:absolute before:bottom-3 before:left-[0.4375rem] before:top-3 before:w-px before:bg-line">
          {t.about.story.map((step, index) => (
            <li key={step.label}>
              <Reveal delay={index * 0.05} className="relative pl-9">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 grid size-[0.9375rem] place-items-center rounded-full border border-line-strong bg-bg"
                >
                  <span className="size-1.5 rounded-full bg-accent" />
                </span>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                  <span className="text-accent">{String(index + 1).padStart(2, "0")}</span> · {step.label}
                </p>
                <p className="mt-2 text-base leading-relaxed text-fg/90 md:text-[1.0625rem]">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.1} className="self-start lg:sticky lg:top-24">
          <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-fg">{t.about.focusTitle}</h3>
          <p className="mt-2 text-sm text-muted">{t.about.focusDescription}</p>
          <ul className="mt-5 space-y-2.5">
            {focusAreas.map((area, index) => (
              <FocusCard key={area.domain} area={area} index={index} />
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
