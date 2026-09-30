"use client";

import { Reveal } from "@/components/layout/Reveal";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Icon } from "@/components/ui/Icon";
import { ZoomableImage } from "@/components/ui/ZoomableImage";
import { beyondTech } from "@/content/beyond-tech";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils/cn";

/** Deliberately smaller than Projects / Research / Journey. */
export function BeyondTech() {
  const { t, l } = useI18n();
  if (beyondTech.length === 0) return null;

  return (
    <Section id="beyond" size="compact">
      <SectionHeader id="beyond" index="08" eyebrow={t.beyond.eyebrow} title={t.beyond.title} size="compact" />
      <ul className="grid gap-4">
        {beyondTech.map((item) => (
          <Reveal as="li" key={item.id}>
            <article
              className={cn(
                "grid h-full max-w-4xl gap-5 rounded-xl border border-line bg-surface p-5",
                item.image && "sm:grid-cols-[minmax(0,1fr)_14rem] sm:items-center",
              )}
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-subtle">{item.org}</p>
                <h3 className="mt-1.5 font-display text-lg font-semibold tracking-tight text-fg">
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:underline"
                    >
                      {l(item.title)}
                      <Icon name="arrowUpRight" size={14} className="text-subtle" />
                      <span className="sr-only">{t.common.newTab}</span>
                    </a>
                  ) : (
                    l(item.title)
                  )}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{l(item.body)}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {l(item.tags).map((tag) => (
                    <li key={tag} className="rounded-md border border-line px-2 py-0.5 font-mono text-xs text-muted">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
              {item.image && (
                <ZoomableImage image={item.image} className="aspect-[4/3]" sizes="224px" />
              )}
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
