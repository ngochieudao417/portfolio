"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { fieldBus } from "@/lib/field-bus";
import { createParticleField, type FieldPalette, type ParticleField } from "./particle-field";

function readPalette(): FieldPalette {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string) => style.getPropertyValue(`--accent-${name}`).trim() || "#8a8f98";
  return {
    ai: read("ai"),
    research: read("research"),
    automation: read("automation"),
    data: read("data"),
    seo: read("seo"),
  };
}

interface ParticleCanvasProps {
  density: "low" | "full";
  interactive: boolean;
  animate: boolean;
}

/** Mounts the Three.js field and wires it to the page: size, visibility, pointer, scroll, theme. */
export default function ParticleCanvas({ density, interactive, animate }: ParticleCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<ParticleField | null>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    // A fresh canvas per mount: a disposed WebGL context can't be reused (Strict Mode remounts).
    const canvas = document.createElement("canvas");
    canvas.className = "block h-full w-full";
    wrap.appendChild(canvas);

    let field: ParticleField;
    try {
      field = createParticleField(canvas, { density, interactive, animate, palette: readPalette(), theme: themeRef.current });
    } catch {
      canvas.remove();
      return; // WebGL unavailable — the hero simply renders without particles.
    }
    fieldRef.current = field;

    let inView = true;
    const sync = () => (inView && !document.hidden ? field.start() : field.stop());

    const resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) field.resize(rect.width, rect.height);
    });
    resizeObserver.observe(wrap);

    const visibilityObserver = new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      sync();
    });
    visibilityObserver.observe(wrap);
    document.addEventListener("visibilitychange", sync);

    const unsubscribe = fieldBus.subscribe((domain) => field.setDomain(domain));

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = wrap.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      field.setPointer(x, y, x >= 0 && y >= 0 && x <= rect.width && y <= rect.height);
    };
    const onPointerLeave = () => field.setPointer(-9999, -9999, false);
    const onScroll = () => field.setScroll(window.scrollY);

    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    sync();

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      unsubscribe();
      field.dispose();
      canvas.remove();
      fieldRef.current = null;
    };
  }, [density, interactive, animate]);

  useEffect(() => {
    fieldRef.current?.setAppearance(theme, readPalette());
  }, [theme]);

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0 animate-fade-in" />
  );
}
