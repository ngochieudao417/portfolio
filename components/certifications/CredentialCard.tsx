"use client";

import { Icon } from "@/components/ui/Icon";
import { ZoomableImage } from "@/components/ui/ZoomableImage";
import type { Credential } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";

/** Credential card: diploma preview (opens full size), name, issuer, period, ID, verification link. */
export function CredentialCard({ credential }: { credential: Credential }) {
  const { t, l } = useI18n();

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-line-strong [--accent:var(--accent-research)]">
      {credential.image && (
        <div className="border-b border-line p-3">
          <ZoomableImage
            image={credential.image}
            className="aspect-[16/10]"
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw"
            position="top"
            hint={t.certifications.viewDiploma}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold tracking-tight text-fg">{credential.name}</h3>
          <span className="shrink-0 font-mono text-xs text-muted">{credential.period ?? credential.year}</span>
        </div>
        <p className="mt-0.5 text-sm text-muted">
          <span className="sr-only">{t.certifications.issuer}: </span>
          {credential.issuer}
        </p>

        {credential.description && (
          <p className="mt-3 text-sm leading-relaxed text-fg/85">{l(credential.description)}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          {credential.credentialId && (
            <p className="font-mono text-xs text-subtle">
              {t.certifications.credentialId}: <span className="text-muted">{credential.credentialId}</span>
            </p>
          )}
          {credential.url && (
            <a
              href={credential.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-sm text-accent hover:underline"
            >
              {t.certifications.verify}
              <Icon name="arrowUpRight" size={14} />
              <span className="sr-only">{t.common.newTab}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
