"use client";

import { SocialIcons } from "@/components/contact/ContactLink";
import { PaletteHint } from "@/components/hero/PaletteHint";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-line pb-8 pt-8 recruiter:pb-28 md:recruiter:pb-24">
      <div className="container-lab flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-muted">
          © {site.copyrightYear} {profile.name}
          <span className="mx-2 text-subtle">·</span>
          <span className="text-subtle">{t.footer.tagline}</span>
        </p>
        <div className="flex items-center gap-3">
          <PaletteHint label={t.footer.palette} className="hidden md:inline-flex" />
          <SocialIcons kinds={["email", "github", "linkedin"]} className="-mr-2.5" />
        </div>
      </div>
    </footer>
  );
}
