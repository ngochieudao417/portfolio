"use client";

import { Reveal } from "@/components/layout/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Pending } from "@/components/ui/Pending";
import { profile } from "@/content/profile";
import { useI18n } from "@/lib/i18n/I18nProvider";

/**
 * Simple GitHub call-to-action with optional, manually curated repositories.
 * No live API dependency — nothing here can fail at runtime.
 */
export function GitHubStrip() {
  const { t, l } = useI18n();
  const url = profile.socials.github;
  const repos = profile.github.selectedRepos;

  if (!profile.github.enabled) return null;
  if (!url) return <Pending className="mt-10" what="GitHub profile URL" where="content/profile.ts → socials.github" />;

  return (
    <Reveal className="mt-10">
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-lg border border-line bg-surface-2 text-fg">
              <Icon name="github" size={20} />
            </span>
            <div>
              <h3 className="font-mono text-sm font-semibold text-fg">{t.projects.githubTitle}</h3>
              <p className="text-sm text-muted">{t.projects.githubDescription}</p>
            </div>
          </div>
          <ButtonLink href={url} target="_blank" rel="noopener noreferrer" variant="secondary" size="md">
            {t.projects.githubCta}
            <Icon name="arrowUpRight" size={15} />
            <span className="sr-only">{t.common.newTab}</span>
          </ButtonLink>
        </div>

        {repos.length > 0 && (
          <div className="mt-6 border-t border-line pt-5">
            <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-subtle">{t.projects.selectedRepos}</h4>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {repos.map((repo) => (
                <li key={repo.url}>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full rounded-lg border border-line p-3 transition-colors hover:border-line-strong"
                  >
                    <span className="flex items-center justify-between gap-2 font-mono text-sm text-fg">
                      {repo.name}
                      <Icon name="arrowUpRight" size={13} className="text-subtle" />
                    </span>
                    <span className="mt-1 block text-xs text-muted">{l(repo.description)}</span>
                    {repo.language && <span className="mt-2 block font-mono text-[0.6875rem] text-subtle">{repo.language}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Reveal>
  );
}
