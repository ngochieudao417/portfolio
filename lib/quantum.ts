"use client";

import type { Domain } from "@/content/types";
import { fieldBus } from "@/lib/field-bus";

/** Easter egg: the lab sits in an equal superposition of its three verbs. */
export const LAB_STATES: Array<{ label: string; domain: Domain }> = [
  { label: "build", domain: "ai" },
  { label: "research", domain: "research" },
  { label: "automate", domain: "automation" },
];

/** "Measures" the state: picks an outcome and tints the particle field to match. */
export function measureLabState() {
  const outcome = LAB_STATES[Math.floor(Math.random() * LAB_STATES.length)] ?? LAB_STATES[0]!;
  fieldBus.pulse(outcome.domain, 3200);
  return outcome;
}
