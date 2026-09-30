"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { useRecruiterMode } from "@/components/recruiter-mode/RecruiterModeProvider";
import { journey } from "@/content/journey";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { TimelineItem } from "./TimelineItem";

/** Interactive vertical timeline. Compact by default; every item expands. */
export function CareerJourney() {
  const { t } = useI18n();
  const { enabled: recruiter } = useRecruiterMode();
  const listRef = useRef<HTMLDivElement>(null);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  // The rail fills as the timeline scrolls through the viewport.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const toggle = (id: string) =>
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <Section id="journey">
      <SectionHeader
        id="journey"
        index="04"
        eyebrow={t.journey.eyebrow}
        title={t.journey.title}
        description={t.journey.description}
      />

      <div ref={listRef} className="relative max-w-3xl">
        <span aria-hidden="true" className="absolute bottom-4 left-[1.125rem] top-4 w-px bg-line sm:left-[1.625rem]" />
        {!recruiter && (
          <motion.span
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute bottom-4 left-[1.125rem] top-4 w-px origin-top bg-gradient-to-b from-[var(--accent-ai)] via-[var(--accent-research)] to-[var(--accent-data)] sm:left-[1.625rem]"
          />
        )}
        <ol className="relative space-y-4">
        {journey.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            delay={index * 0.05}
            // Recruiter mode opens everything — no clicking required to scan.
            open={recruiter || openIds.has(item.id)}
            onToggle={() => toggle(item.id)}
          />
        ))}
        </ol>
      </div>
    </Section>
  );
}
