"use client";

import { Reveal } from "@/components/layout/Reveal";
import { Section, SectionHeader } from "@/components/layout/Section";
import { certifications } from "@/content/certifications";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { CredentialCard } from "./CredentialCard";

export function Certifications() {
  const { t } = useI18n();
  return (
    <Section id="certifications">
      <SectionHeader id="certifications" index="07" eyebrow={t.certifications.eyebrow} title={t.certifications.title} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((credential, index) => (
          <Reveal as="li" key={credential.id} delay={index * 0.05}>
            <CredentialCard credential={credential} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
