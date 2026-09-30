import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-line bg-surface-2/70 px-2 py-0.5 font-mono text-[0.75rem] leading-5 text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TagList({ tags, className, limit }: { tags: string[]; className?: string; limit?: number }) {
  const visible = limit ? tags.slice(0, limit) : tags;
  const hidden = tags.length - visible.length;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map((tag) => (
        <li key={tag}>
          <Tag>{tag}</Tag>
        </li>
      ))}
      {hidden > 0 && (
        <li>
          <Tag className="text-subtle">+{hidden}</Tag>
        </li>
      )}
    </ul>
  );
}

/** Small mono label with a coloured dot — domain / category metadata. */
export function DomainLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted", className)}>
      <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
      {children}
    </span>
  );
}
