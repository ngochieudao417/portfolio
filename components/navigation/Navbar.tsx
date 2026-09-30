"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CvButton } from "@/components/contact/CvButton";
import { RecruiterModeToggle } from "@/components/recruiter-mode/RecruiterModeToggle";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils/cn";
import { LanguageToggle } from "./LanguageToggle";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NAV_ITEMS } from "./nav-items";
import { useActiveSection } from "./useActiveSection";
import { scrollToSection } from "./useNavigateTo";

const PRIMARY = NAV_ITEMS.filter((item) => item.primary);

export function Navbar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(
    PRIMARY.map((item) => item.id),
    isHome,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300",
        solid ? "border-line bg-bg/80 backdrop-blur-md" : "border-transparent",
      )}
    >
      <nav aria-label={t.nav.label} className="container-lab flex h-16 items-center gap-4">
        <Logo />

        <ul className="ml-4 hidden items-center xl:flex">
          {PRIMARY.map((item) => {
            const isActive = isHome && active === item.id;
            return (
              <li key={item.id} className="relative">
                <Link
                  href={item.id === "top" ? "/" : `/#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(event) => {
                    if (isHome) {
                      event.preventDefault();
                      scrollToSection(item.id);
                    }
                  }}
                  className={cn(
                    "block rounded-md px-2.5 py-2 font-mono text-[0.8125rem] transition-colors",
                    isActive ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {t.nav[item.key]}
                </Link>
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2.5 -bottom-[13px] h-px bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <RecruiterModeToggle />
          <LanguageToggle className="hidden md:flex" />
          <ThemeToggle className="hidden md:grid" />
          {/* Wrappers own the responsive display so it never fights the button's own inline-flex. */}
          <span className="hidden md:inline-flex xl:hidden 2xl:inline-flex">
            <CvButton size="sm" />
          </span>
          <span className="hidden xl:inline-flex 2xl:hidden">
            <CvButton size="sm" iconOnly />
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="grid size-9 place-items-center rounded-lg border border-line text-fg xl:hidden"
          >
            <Icon name="menu" size={18} />
          </button>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} active={isHome ? active : null} />
    </header>
  );
}
