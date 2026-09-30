"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

function calm(): boolean {
  return (
    document.documentElement.getAttribute("data-recruiter") === "true" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Scrolls to a home-page section id and moves focus there for keyboard/screen-reader users. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: calm() ? "auto" : "smooth", block: "start" });
  if (id !== "top") el.focus({ preventScroll: true });
  history.replaceState(null, "", id === "top" ? window.location.pathname : `#${id}`);
  return true;
}

/**
 * Navigate to "#section" (scroll on the home page, route home elsewhere)
 * or to an internal path.
 */
export function useNavigateTo() {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (target: string) => {
      if (target.startsWith("#")) {
        const id = target.slice(1);
        if (pathname === "/" && scrollToSection(id)) return;
        router.push(id === "top" ? "/" : `/${target}`);
        return;
      }
      router.push(target);
    },
    [pathname, router],
  );
}
