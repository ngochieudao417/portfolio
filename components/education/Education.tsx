"use client";

import Image from "next/image";
import { useAsset } from "@/components/layout/AssetsProvider";
import { Reveal } from "@/components/layout/Reveal";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Icon } from "@/components/ui/Icon";
import { Pending } from "@/components/ui/Pending";
import { ZoomableImage } from "@/components/ui/ZoomableImage";
import { education } from "@/content/education";
import type { EducationItem } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";

function Institution({ item }: { item: EducationItem }) {
  const { t, l } = useI18n();
  const logo = useAsset(item.logo?.src);
  const undated = item.achievements.filter((achievement) => !achievement.year);

  return (
    <article className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[auto_minmax(0,1fr)] md:gap-8">
        <div className="relative grid size-20 place-items-center overflow-hidden rounded-xl border border-line bg-surface-2 sm:size-24">
          {logo && item.logo ? (
            <Image src={logo} alt={l(item.logo.alt)} fill sizes="96px" className="object-contain p-3" />
          ) : (
            <span className="font-display text-xl font-bold tracking-tight text-fg">{item.short}</span>
          )}
        </div>

        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl">{item.institution}</h3>
          {item.localName && <p className="mt-0.5 text-sm text-muted">{item.localName}</p>}

          <dl className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">{t.education.program}</dt>
              <dd className="mt-1 text-sm text-fg">{l(item.program)}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">{t.education.period}</dt>
              <dd className="mt-1 font-mono text-sm text-fg">{item.period}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">{t.common.location}</dt>
              <dd className="mt-1 text-sm text-fg">{l(item.location)}</dd>
            </div>
            {item.gpa && (
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">{t.education.gpa}</dt>
                <dd className="mt-1 font-mono text-sm text-fg">{item.gpa}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {item.achievements.length > 0 && (
        <div className="border-t border-line bg-bg-elevated/50 p-5 sm:px-7">
          <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t.education.achievements}</h4>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {item.achievements.map((achievement) => (
              <li
                key={achievement.title.en}
                className="flex items-start gap-3 rounded-lg border border-line bg-surface p-4 [--accent:var(--accent-research)]"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-md border border-line bg-surface-2 text-accent">
                  <Icon name="award" size={17} />
                </span>
                <span>
                  <span className="block text-[0.9375rem] font-medium leading-snug text-fg">{l(achievement.title)}</span>
                  {achievement.year && <span className="mt-1 block font-mono text-xs text-muted">{achievement.year}</span>}
                  {achievement.detail && <span className="mt-1 block text-sm text-muted">{l(achievement.detail)}</span>}
                </span>
              </li>
            ))}
          </ul>
          {undated.length > 0 && <Pending className="mt-3" what="award years / research titles" where="content/education.ts" />}
        </div>
      )}

      {item.research && <StudentResearch research={item.research} />}
    </article>
  );
}

function StudentResearch({ research }: { research: NonNullable<EducationItem["research"]> }) {
  const { t, l } = useI18n();
  return (
    <div className="grid gap-5 border-t border-line p-5 sm:px-7 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:gap-7 [--accent:var(--accent-research)]">
      {research.image && (
        <ZoomableImage image={research.image} className="aspect-[4/3]" sizes="(min-width: 768px) 272px, 90vw" />
      )}
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          {t.education.research}
          {research.year && <span className="font-normal text-subtle"> · {research.year}</span>}
        </p>
        <h4 className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight text-fg">{l(research.title)}</h4>
        <p className="mt-2 text-sm leading-relaxed text-muted">{l(research.summary)}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {l(research.facts).map((fact) => (
            <li key={fact} className="rounded-md border border-line bg-surface-2/70 px-2 py-0.5 font-mono text-xs text-fg/85">
              {fact}
            </li>
          ))}
        </ul>
        <a
          href={research.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-sm text-accent hover:underline"
        >
          {t.common.article}
          <Icon name="arrowUpRight" size={14} />
          <span className="sr-only">{t.common.newTab}</span>
        </a>
      </div>
    </div>
  );
}

export function Education() {
  const { t } = useI18n();
  return (
    <Section id="education">
      <SectionHeader id="education" index="06" eyebrow={t.education.eyebrow} title={t.education.title} />
      <div className="space-y-5">
        {education.map((item) => (
          <Reveal key={item.id}>
            <Institution item={item} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
