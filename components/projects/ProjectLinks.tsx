"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Pending } from "@/components/ui/Pending";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface LinkSpec {
  key: string;
  url?: string;
  icon: IconName;
  label: string;
}

/** External links for a project or research entry. Missing ones are hidden (dev: flagged). */
export function ProjectLinks({
  links,
  source,
  expected = [],
}: {
  links: { github?: string; demo?: string; paper?: string; repo?: string; slides?: string; article?: string };
  source: string;
  /** Link keys this item should eventually have — flagged in dev when empty. */
  expected?: string[];
}) {
  const { t } = useI18n();
  const specs: LinkSpec[] = [
    { key: "github", url: links.github, icon: "github", label: t.common.github },
    { key: "repo", url: links.repo, icon: "github", label: t.common.repository },
    { key: "demo", url: links.demo, icon: "play", label: t.common.demo },
    { key: "paper", url: links.paper, icon: "book", label: t.common.paper },
    { key: "slides", url: links.slides, icon: "book", label: t.common.slides },
    { key: "article", url: links.article, icon: "book", label: t.common.article },
  ];
  const available = specs.filter((spec) => spec.url);
  const missing = specs.filter((spec) => !spec.url && expected.includes(spec.key));

  return (
    <div className="space-y-2">
      {available.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {available.map((spec) => (
            <ButtonLink
              key={spec.key}
              href={spec.url!}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
            >
              <Icon name={spec.icon} size={15} />
              {spec.label}
              <Icon name="arrowUpRight" size={13} className="text-subtle" />
              <span className="sr-only">{t.common.newTab}</span>
            </ButtonLink>
          ))}
        </div>
      )}
      {missing.length > 0 && (
        <Pending what={`links: ${missing.map((spec) => spec.key).join(", ")}`} where={source} />
      )}
    </div>
  );
}
