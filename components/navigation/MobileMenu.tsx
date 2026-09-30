"use client";

import { motion } from "framer-motion";
import { SocialIcons } from "@/components/contact/ContactLink";
import { CvButton } from "@/components/contact/CvButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils/cn";
import { LanguageToggle } from "./LanguageToggle";
import { NAV_ITEMS } from "./nav-items";
import { useNavigateTo } from "./useNavigateTo";

const ITEMS = NAV_ITEMS.filter((item) => item.primary);

export function MobileMenu({ open, onClose, active }: { open: boolean; onClose: () => void; active: string | null }) {
  const { t } = useI18n();
  const navigateTo = useNavigateTo();

  return (
    <Dialog open={open} onClose={onClose} label={t.nav.menu} placement="full" className="flex h-full w-full">
      <div id="mobile-menu" className="flex h-full w-full flex-col bg-bg">
        <div className="container-lab flex h-16 shrink-0 items-center justify-between border-b border-line">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">{t.nav.menu}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.nav.closeMenu}
            className="grid size-9 place-items-center rounded-lg border border-line"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav aria-label={t.nav.label} className="container-lab scroll-thin flex-1 overflow-y-auto py-6">
          <ul className="space-y-1">
            {ITEMS.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * index, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    // Let the dialog release scroll lock before scrolling.
                    window.setTimeout(() => navigateTo(`#${item.id}`), 60);
                  }}
                  aria-current={active === item.id ? "location" : undefined}
                  className={cn(
                    "flex w-full items-baseline gap-4 rounded-lg px-2 py-3 text-left font-display text-2xl font-semibold tracking-tight transition-colors",
                    active === item.id ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  <span className="font-mono text-xs font-normal text-accent">{String(index).padStart(2, "0")}</span>
                  {t.nav[item.key]}
                </button>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className="container-lab shrink-0 space-y-4 border-t border-line py-5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">{t.nav.preferences}</span>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle className="border border-line" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <SocialIcons kinds={["github", "linkedin", "email"]} className="-ml-2" />
            <CvButton variant="primary" size="md" />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
