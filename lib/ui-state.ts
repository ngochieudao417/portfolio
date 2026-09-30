"use client";

import type { Domain } from "@/content/types";
import { createStore } from "@/lib/utils/store";

/** Shared UI state that several unrelated components read or drive. */

export type ProjectFilter = "featured" | "all" | Domain;
export const projectFilterStore = createStore<ProjectFilter>("featured");

export const overlayStore = createStore<{ palette: boolean; terminal: boolean }>({
  palette: false,
  terminal: false,
});

export function openOverlay(name: "palette" | "terminal") {
  overlayStore.set({ palette: name === "palette", terminal: name === "terminal" });
}

export function closeOverlays() {
  overlayStore.set({ palette: false, terminal: false });
}

export interface Toast {
  id: number;
  message: string;
  accent?: Domain;
}

export const toastStore = createStore<Toast | null>(null);
let toastId = 0;
let toastTimer: ReturnType<typeof setTimeout> | undefined;

export function showToast(message: string, accent?: Domain, duration = 3200) {
  toastId += 1;
  toastStore.set({ id: toastId, message, accent });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastStore.set(null), duration);
}
