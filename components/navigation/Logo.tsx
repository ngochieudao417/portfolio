"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/content/profile";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { measureLabState } from "@/lib/quantum";
import { showToast } from "@/lib/ui-state";
import { scrollToSection } from "./useNavigateTo";

/**
 * The logo is a ket, |ĐNH⟩. Double-click it to "measure" the lab — a small
 * quantum Easter egg that collapses the particle field into one domain colour.
 */
export function Logo() {
  const { t } = useI18n();
  const pathname = usePathname();

  return (
    <Link
      href="/"
      aria-label={t.nav.logoLabel}
      onClick={(event) => {
        if (pathname === "/") {
          event.preventDefault();
          scrollToSection("top");
        }
      }}
      onDoubleClick={() => {
        const outcome = measureLabState();
        showToast(`${t.quantum.collapsed} |${outcome.label}⟩`, outcome.domain);
      }}
      className="group flex select-none items-center gap-0.5 rounded-md font-mono text-[0.9375rem] font-semibold tracking-tight text-fg"
    >
      <span className="text-subtle transition-colors group-hover:text-accent">|</span>
      <span>{profile.initials}</span>
      <span className="text-subtle transition-colors group-hover:text-accent">⟩</span>
    </Link>
  );
}
