"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { SocialIcons } from "@/components/contact/ContactLink";
import { CvButton } from "@/components/contact/CvButton";
import { education } from "@/content/education";
import { journey } from "@/content/journey";
import { profile } from "@/content/profile";
import { research } from "@/content/research";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { DOMAINS, domainColor } from "@/lib/utils/domains";
import { useRecruiterMode } from "./RecruiterModeProvider";

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-surface p-5">
      <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-subtle">{label}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-fg">{children}</dd>
    </div>
  );
}

/**
 * Recruiter mode only: answers "who, what, where, how to contact" in one
 * scannable block, derived from the same content as the rest of the page.
 */
export function RecruiterSummary() {
  const { enabled } = useRecruiterMode();
  const { t, l } = useI18n();
  const s = t.recruiter.summary;

  const experience = journey.filter((item) => item.type === "work" || item.type === "research");
  const awards = journey.filter((item) => item.type === "award");
  const school = education[0];

  return (
    <AnimatePresence initial={false}>
      {enabled && (
        <motion.section
          key="summary"
          aria-labelledby="summary-title"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="container-lab pb-6">
            <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4">
                <div>
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--accent-seo)]">{s.eyebrow}</p>
                  <h2 id="summary-title" className="mt-1 font-display text-lg font-semibold tracking-tight">
                    {s.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <SocialIcons kinds={["email", "linkedin", "github"]} />
                  <CvButton variant="primary" size="md" />
                </div>
              </div>

              <dl className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
                <Cell label={s.who}>
                  <strong className="font-semibold">{profile.name}</strong> — {l(profile.roleText)}.{" "}
                  <span className="text-muted">{l(profile.location)}</span>
                </Cell>
                <Cell label={s.focus}>
                  <span className="flex flex-wrap gap-x-3 gap-y-1">
                    {DOMAINS.map((domain) => (
                      <span key={domain} className="inline-flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full" style={{ background: domainColor(domain) }} />
                        {t.domains[domain]}
                      </span>
                    ))}
                  </span>
                </Cell>
                <Cell label={s.experience}>
                  <ul className="space-y-1">
                    {experience.map((item) => (
                      <li key={item.id}>
                        <strong className="font-semibold">{item.org}</strong> — {l(item.role)}
                        {item.period && <span className="font-mono text-xs text-muted"> · {item.period}</span>}
                      </li>
                    ))}
                  </ul>
                </Cell>
                <Cell label={s.research}>
                  <ul className="space-y-1">
                    {research.map((entry) => (
                      <li key={entry.slug}>{l(entry.title)}</li>
                    ))}
                  </ul>
                </Cell>
                {school && (
                  <Cell label={s.education}>
                    <strong className="font-semibold">{school.institution}</strong> — {l(school.program)}
                    <span className="font-mono text-xs text-muted"> · {school.period}</span>
                  </Cell>
                )}
                <Cell label={s.highlights}>
                  <ul className="space-y-1">
                    {awards.map((item) => (
                      <li key={item.id}>
                        <strong className="font-semibold">{l(item.role)}</strong> — {item.org}
                      </li>
                    ))}
                    {school?.achievements.map((achievement) => (
                      <li key={achievement.title.en}>{l(achievement.title)}</li>
                    ))}
                  </ul>
                </Cell>
              </dl>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
