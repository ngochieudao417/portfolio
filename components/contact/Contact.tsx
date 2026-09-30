"use client";

import { useId } from "react";
import { Reveal } from "@/components/layout/Reveal";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { profile } from "@/content/profile";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { showToast } from "@/lib/ui-state";
import { ContactForm } from "./ContactForm";
import { ContactLink, useContactEntries } from "./ContactLink";
import { CvButton } from "./CvButton";

/** Hiring CTA + direct links + contact form. `formEnabled` is resolved on the server from env. */
export function Contact({ formEnabled }: { formEnabled: boolean }) {
  const { t } = useI18n();
  const nameInputId = useId();
  const entries = useContactEntries(["email", "phone", "linkedin", "github", "location"]);

  const focusForm = () => {
    const input = document.getElementById(nameInputId);
    const target = input ?? document.getElementById("contact-form");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    input?.focus({ preventScroll: true });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      showToast(t.common.copied, "seo");
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <Section id="contact" className="border-t border-line">
      <SectionHeader id="contact" index="09" eyebrow={t.contact.eyebrow} title={t.contact.title} description={t.contact.description} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
        <Reveal>
          <div className="flex flex-wrap gap-3">
            <CvButton variant="primary" size="lg" />
            <Button variant="secondary" size="lg" onClick={focusForm}>
              <Icon name="mail" size={16} />
              {t.contact.contactMe}
            </Button>
          </div>

          <div className="mt-8">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-subtle">{t.contact.openTo}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {t.contact.openToItems.map((item) => (
                <li key={item} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-subtle">{t.contact.direct}</p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {entries.map((entry) => (
                <li key={entry.kind} className="flex min-w-0 items-center gap-2">
                  <ContactLink entry={entry} className="min-w-0 flex-1" />
                  {entry.kind === "email" && !entry.missing && (
                    <button
                      type="button"
                      onClick={copyEmail}
                      aria-label={t.contact.copyEmail}
                      title={t.contact.copyEmail}
                      className="grid size-8 shrink-0 place-items-center rounded-md text-subtle transition-colors hover:bg-surface-2 hover:text-fg"
                    >
                      <Icon name="copy" size={15} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div id="contact-form" className="rounded-xl border border-line bg-surface p-5 shadow-card sm:p-7">
            <h3 className="mb-5 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-fg">{t.contact.form.title}</h3>
            <ContactForm enabled={formEnabled} nameInputId={nameInputId} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
