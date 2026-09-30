"use client";

import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils/cn";

export type ContactKind = "email" | "phone" | "github" | "linkedin" | "location";

interface ContactEntry {
  kind: ContactKind;
  icon: IconName;
  value: string;
  href: string | null;
  display: string;
}

/** Builds contact entries from the central profile. Empty values are dropped. */
export function useContactEntries(kinds: ContactKind[]): Array<ContactEntry & { missing: boolean }> {
  const { l } = useI18n();
  const all: Record<ContactKind, ContactEntry> = {
    email: {
      kind: "email",
      icon: "mail",
      value: profile.email,
      href: profile.email ? `mailto:${profile.email}` : null,
      display: profile.email,
    },
    phone: {
      kind: "phone",
      icon: "phone",
      value: profile.phone,
      href: profile.phone ? `tel:${profile.phone.replace(/[^\d+]/g, "")}` : null,
      display: profile.phone,
    },
    github: {
      kind: "github",
      icon: "github",
      value: profile.socials.github,
      href: profile.socials.github || null,
      display: prettyUrl(profile.socials.github),
    },
    linkedin: {
      kind: "linkedin",
      icon: "linkedin",
      value: profile.socials.linkedin,
      href: profile.socials.linkedin || null,
      display: prettyUrl(profile.socials.linkedin),
    },
    location: {
      kind: "location",
      icon: "pin",
      value: l(profile.location),
      href: null,
      display: l(profile.location),
    },
  };

  return kinds
    .map((kind) => ({ ...all[kind], missing: !all[kind].value }))
    .filter((entry) => !entry.missing || site.showPlaceholders);
}

function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

/** Row-style contact link: icon, label, value. */
export function ContactLink({ entry, className }: { entry: ContactEntry & { missing: boolean }; className?: string }) {
  const { t } = useI18n();
  const label = t.common[entry.kind];
  const inner = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-md border border-line bg-surface-2 text-muted transition-colors group-hover:border-accent group-hover:text-accent">
        <Icon name={entry.icon} size={16} />
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">{label}</span>
        <span className={cn("block truncate text-sm", entry.missing ? "font-mono text-subtle" : "text-fg")}>
          {entry.missing ? "// TODO content/profile.ts" : entry.display}
        </span>
      </span>
    </>
  );

  const classes = cn("group flex min-w-0 items-center gap-3 rounded-lg p-1.5 -m-1.5", className);

  if (!entry.href) return <div className={classes}>{inner}</div>;
  const external = isExternal(entry.href);
  return (
    <a
      href={entry.href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
      {external && <span className="sr-only">{t.common.newTab}</span>}
    </a>
  );
}

/** Compact icon-only social row (hero, footer). */
export function SocialIcons({ kinds, className }: { kinds: ContactKind[]; className?: string }) {
  const { t } = useI18n();
  const entries = useContactEntries(kinds);
  if (entries.length === 0) return null;
  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {entries.map((entry) => (
        <li key={entry.kind}>
          {entry.href ? (
            <a
              href={entry.href}
              aria-label={t.common[entry.kind]}
              title={t.common[entry.kind]}
              className="grid size-10 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-fg"
              {...(isExternal(entry.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <Icon name={entry.icon} size={18} />
            </a>
          ) : (
            <span
              title={`${t.common[entry.kind]} — TODO content/profile.ts`}
              className="grid size-10 place-items-center rounded-lg border border-dashed border-line text-subtle"
            >
              <Icon name={entry.icon} size={18} />
              <span className="sr-only">{t.common[entry.kind]}</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
