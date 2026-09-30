"use client";

import type { SkillGroup as SkillGroupData } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { accentStyle } from "@/lib/utils/domains";

export function SkillGroup({ group }: { group: SkillGroupData }) {
  const { l } = useI18n();
  return (
    <article
      style={accentStyle(group.domain)}
      className="relative h-full overflow-hidden rounded-xl border border-line bg-surface p-5"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-accent opacity-80" />
      <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-fg">
        <span aria-hidden="true" className="text-accent">
          {">"}
        </span>
        {l(group.title)}
      </h3>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {group.items.map((item) => (
          <li
            key={item}
            className="rounded-md border border-line bg-surface-2/70 px-2.5 py-1 font-mono text-[0.8125rem] text-fg/90"
          >
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
