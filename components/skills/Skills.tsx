"use client";

import { Reveal } from "@/components/layout/Reveal";
import { Section, SectionHeader } from "@/components/layout/Section";
import { skills } from "@/content/skills";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { SkillGroup } from "./SkillGroup";

export function Skills() {
  const { t } = useI18n();
  return (
    <Section id="skills">
      <SectionHeader
        id="skills"
        index="05"
        eyebrow={t.skills.eyebrow}
        title={t.skills.title}
        description={t.skills.description}
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, index) => (
          <Reveal as="li" key={group.id} delay={(index % 3) * 0.05}>
            <SkillGroup group={group} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
