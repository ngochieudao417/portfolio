"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { STORAGE_KEYS, writeStorage } from "@/lib/utils/storage";

export type Theme = "dark" | "light";

interface ThemeValue {
  theme: Theme;
  /** `origin` (viewport coords) drives the circular reveal where supported. */
  setTheme: (theme: Theme, origin?: { x: number; y: number }) => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

const THEME_COLORS: Record<Theme, string> = { dark: "#0a0b0d", light: "#f4f3ef" };

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
}

function prefersCalm(): boolean {
  return (
    document.documentElement.getAttribute("data-recruiter") === "true" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    // The inline preference script already applied the stored theme; sync React to it.
    if (document.documentElement.getAttribute("data-theme") === "light") setThemeState("light");
  }, []);

  const setTheme = useCallback<ThemeValue["setTheme"]>((next, origin) => {
    const commit = () => {
      // Attribute first: effects that read CSS tokens (the particle palette) run inside flushSync.
      applyTheme(next);
      flushSync(() => setThemeState(next));
    };
    writeStorage(STORAGE_KEYS.theme, next);

    if (!origin || typeof document.startViewTransition !== "function" || prefersCalm()) {
      commit();
      return;
    }

    const radius = Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y),
    );
    const transition = document.startViewTransition(commit);
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${origin.x}px ${origin.y}px)`,
              `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
            ],
          },
          { duration: 480, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {
        /* transition skipped — theme is already applied */
      });
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside <ThemeProvider>");
  return value;
}
