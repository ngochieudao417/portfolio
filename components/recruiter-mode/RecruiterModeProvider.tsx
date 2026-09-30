"use client";

import { useReducedMotion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { STORAGE_KEYS, writeStorage } from "@/lib/utils/storage";

interface RecruiterModeValue {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
}

const RecruiterModeContext = createContext<RecruiterModeValue | null>(null);

export function RecruiterModeProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(false);

  useEffect(() => {
    // Applied before paint by the inline preference script; sync React to it.
    if (document.documentElement.getAttribute("data-recruiter") === "true") setEnabledState(true);
  }, []);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    writeStorage(STORAGE_KEYS.recruiter, next ? "1" : "0");
    if (next) document.documentElement.setAttribute("data-recruiter", "true");
    else document.documentElement.removeAttribute("data-recruiter");
  }, []);

  const value = useMemo<RecruiterModeValue>(
    () => ({ enabled, setEnabled, toggle: () => setEnabled(!enabled) }),
    [enabled, setEnabled],
  );

  return <RecruiterModeContext.Provider value={value}>{children}</RecruiterModeContext.Provider>;
}

export function useRecruiterMode(): RecruiterModeValue {
  const value = useContext(RecruiterModeContext);
  if (!value) throw new Error("useRecruiterMode must be used inside <RecruiterModeProvider>");
  return value;
}

const subscribeNoop = () => () => {};

/** false on the server and during hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

/**
 * True when motion should be minimal: recruiter mode or the OS reduced-motion setting.
 * Always false until hydration finishes — the server can't know the OS setting, and
 * rendering different markup on the first client pass breaks hydration.
 */
export function useCalmMode(): boolean {
  const reduced = useReducedMotion();
  const { enabled } = useRecruiterMode();
  const hydrated = useHydrated();
  return hydrated && (enabled || Boolean(reduced));
}
