"use client";

import type { Domain } from "@/content/types";

/**
 * Lets any component tint the hero particle field toward a domain accent
 * (hovering "build / research / automate", the quantum Easter egg…) without
 * coupling to the Three.js code. `null` restores the mixed palette.
 */
type Listener = (domain: Domain | null) => void;

const listeners = new Set<Listener>();
let releaseTimer: ReturnType<typeof setTimeout> | undefined;

export const fieldBus = {
  emit(domain: Domain | null) {
    clearTimeout(releaseTimer);
    listeners.forEach((listener) => listener(domain));
  },
  /** Tint for a while, then release back to the mixed palette. */
  pulse(domain: Domain, ms = 2400) {
    fieldBus.emit(domain);
    releaseTimer = setTimeout(() => fieldBus.emit(null), ms);
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
