"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";

export function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="fixed left-4 top-3 z-[200] -translate-y-24 rounded-md bg-accent px-4 py-2 font-mono text-sm text-on-accent transition-transform focus:translate-y-0"
    >
      {t.nav.skip}
    </a>
  );
}
