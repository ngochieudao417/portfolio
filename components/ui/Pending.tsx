import { site } from "@/content/site";
import { cn } from "@/lib/utils/cn";

/**
 * Development-only marker for content that hasn't been supplied yet.
 * Renders nothing in production, so visitors never see placeholders.
 */
export function Pending({ what, where, className }: { what: string; where: string; className?: string }) {
  if (!site.showPlaceholders) return null;
  return (
    <p
      className={cn(
        "rounded-md border border-dashed border-line-strong px-3 py-2 font-mono text-xs leading-relaxed text-subtle",
        className,
      )}
    >
      <span className="text-accent">{"// TODO"}</span> {what} <span className="opacity-70">→ {where}</span>
    </p>
  );
}
