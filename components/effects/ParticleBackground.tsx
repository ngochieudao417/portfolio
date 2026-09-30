"use client";

import { useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRecruiterMode } from "@/components/recruiter-mode/RecruiterModeProvider";

// Three.js is only downloaded when the device can afford the effect.
const ParticleCanvas = dynamic(() => import("./ParticleCanvas"), { ssr: false });

type Capability = "none" | "low" | "full";

function detectCapability(): Capability {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return "none";

  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!gl) return "none";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return "none";
  }

  const handheld = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
  const lowPower = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  if (handheld && lowPower) return "none";
  if (handheld || lowPower) return "low";
  return "full";
}

/**
 * Decides whether and how to run the particle field, then lazy-loads it after
 * the page is idle so it never competes with first paint.
 * Recruiter mode disables it entirely; reduced motion renders a still frame.
 */
export function ParticleBackground() {
  const { enabled: recruiter } = useRecruiterMode();
  const reducedMotion = useReducedMotion();
  const [capability, setCapability] = useState<Capability | null>(null);

  useEffect(() => {
    const run = () => setCapability(detectCapability());
    if ("requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(run, { timeout: 1500 });
      return () => window.cancelIdleCallback(handle);
    }
    const timer = setTimeout(run, 250);
    return () => clearTimeout(timer);
  }, []);

  if (recruiter || !capability || capability === "none") return null;

  return (
    <ParticleCanvas
      density={capability}
      interactive={capability === "full" && !reducedMotion}
      animate={!reducedMotion}
    />
  );
}
