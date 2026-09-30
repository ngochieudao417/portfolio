"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import type { PointerEvent } from "react";
import { useAsset } from "@/components/layout/AssetsProvider";
import { useCalmMode } from "@/components/recruiter-mode/RecruiterModeProvider";
import { profile } from "@/content/profile";
import { useI18n } from "@/lib/i18n/I18nProvider";

/** Monogram "specimen" shown until public/images/profile.jpg is added. */
function PortraitPlaceholder({ label }: { label: string }) {
  return (
    <div className="lab-grid absolute inset-0 grid place-items-center bg-surface-2">
      <div className="text-center">
        <p className="font-display text-3xl font-bold tracking-tight text-fg/80 sm:text-5xl lg:text-7xl">{profile.initials}</p>
        <p className="mt-3 hidden font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-subtle sm:block">{label}</p>
      </div>
    </div>
  );
}

export function Portrait() {
  const { t, l } = useI18n();
  const src = useAsset(profile.portrait.src);
  const calm = useCalmMode();

  // Subtle 3D tilt toward the cursor (fine pointers, full-motion only).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 150, damping: 20 });
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 150, damping: 20 });
  const glareX = useTransform(px, [0, 1], ["20%", "80%"]);
  const glareY = useTransform(py, [0, 1], ["10%", "90%"]);
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(420px circle at ${x} ${y}, rgb(255 255 255 / 0.18), transparent 60%)`,
  );

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (calm || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <figure className="relative ml-1.5 w-28 sm:w-44 md:mx-auto md:w-52 lg:w-full lg:max-w-[26rem]">
      <motion.div
        onPointerMove={onPointerMove}
        onPointerLeave={reset}
        style={calm ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
        className="brackets relative aspect-[4/5] rounded-xl [--accent:var(--accent-ai)]"
      >
        <div className="absolute inset-0 overflow-hidden rounded-xl border border-line-strong bg-surface shadow-card">
          {src ? (
            <Image
              src={src}
              alt={l(profile.portrait.alt)}
              fill
              priority
              sizes="(min-width: 1024px) 416px, (min-width: 768px) 208px, (min-width: 640px) 176px, 112px"
              className="object-cover object-[50%_30%] [filter:var(--portrait-filter)]"
            />
          ) : (
            <PortraitPlaceholder label={t.hero.portraitPending} />
          )}
          {!calm && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60 mix-blend-soft-light"
              style={{ background: glare }}
            />
          )}
          <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 opacity-40 light:opacity-20" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/50 to-transparent"
          />
        </div>
      </motion.div>
      <figcaption className="mt-4 hidden items-center justify-between gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-subtle lg:flex">
        <span>
          {t.hero.portraitCaption} — {profile.name}
        </span>
        <span>{profile.coordinates}</span>
      </figcaption>
    </figure>
  );
}
