"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { closeOverlays, openOverlay, overlayStore } from "@/lib/ui-state";
import { useStore } from "@/lib/utils/store";

type Overlay = ComponentType<{ open: boolean }>;

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/**
 * Global shortcuts: ⌘K / Ctrl+K → command palette, ` → terminal.
 * Both overlays are code-split; the chunks are fetched when the page goes idle
 * (or on first use) and rendered directly, so the first keystroke is never lost
 * to a loading round-trip.
 */
export function LabOverlays() {
  const overlays = useStore(overlayStore);
  const [modules, setModules] = useState<{ palette?: Overlay; terminal?: Overlay }>({});
  const loading = useRef(false);

  const load = useCallback(() => {
    if (loading.current) return;
    loading.current = true;
    void Promise.all([import("./CommandPalette"), import("./Terminal")]).then(([palette, terminal]) =>
      setModules({ palette: palette.default, terminal: terminal.default }),
    );
  }, []);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(load, { timeout: 4000 });
      return () => window.cancelIdleCallback(handle);
    }
    const timer = setTimeout(load, 2000);
    return () => clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    if (overlays.palette || overlays.terminal) load();
  }, [overlays, load]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (overlayStore.get().palette) closeOverlays();
        else openOverlay("palette");
        return;
      }
      if (event.key === "`" && !event.metaKey && !event.ctrlKey && !event.altKey && !isTyping(event.target)) {
        event.preventDefault();
        openOverlay("terminal");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const { palette: CommandPalette, terminal: Terminal } = modules;
  return (
    <>
      {CommandPalette && <CommandPalette open={overlays.palette} />}
      {Terminal && <Terminal open={overlays.terminal} />}
    </>
  );
}
