"use client";

import { motion, type MotionProps } from "framer-motion";
import { SocialIcons } from "@/components/contact/ContactLink";
import { CvButton } from "@/components/contact/CvButton";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import { scrollToSection } from "@/components/navigation/useNavigateTo";
import { useCalmMode } from "@/components/recruiter-mode/RecruiterModeProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { profile } from "@/content/profile";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { fieldBus } from "@/lib/field-bus";
import { accentStyle, domainColor } from "@/lib/utils/domains";
import { PaletteHint } from "./PaletteHint";
import { Portrait } from "./Portrait";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const { t, l } = useI18n();
  const calm = useCalmMode();

  // Entrance for secondary elements only — the name (LCP) paints immediately.
  // Calm mode resolves after hydration, so it must still *animate to* the visible
  // state (instantly) rather than drop the animation and stay at the initial style.
  const enter = (delay: number): Pick<MotionProps, "initial" | "animate" | "transition"> => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: calm ? { duration: 0 } : { duration: 0.6, delay, ease: EASE },
  });

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      tabIndex={-1}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-24 outline-none sm:pt-28 recruiter:min-h-0 recruiter:pb-10 recruiter:pt-24 sm:recruiter:pt-28"
    >
      <div aria-hidden="true" className="lab-grid lab-grid-fade absolute inset-0" />
      <div aria-hidden="true" className="hero-glow absolute inset-0" />
      <ParticleBackground />

      <div className="container-lab relative grid items-center gap-7 sm:gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
        <div className="order-2 lg:order-1">
          <motion.p
            {...enter(0)}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.18em] text-muted"
          >
            {profile.availability.open && (
              <span className="inline-flex items-center gap-2 text-fg">
                <span
                  className="status-dot size-2 rounded-full bg-[var(--accent-seo)] text-[var(--accent-seo)]"
                  aria-hidden="true"
                />
                {t.hero.status}
              </span>
            )}
            <span className="text-subtle" aria-hidden="true">
              /
            </span>
            <span>{l(profile.location)}</span>
          </motion.p>

          <h1
            id="hero-title"
            className="mt-6 font-display text-[2.5rem] font-bold leading-[1.1] tracking-[-0.045em] text-fg sm:text-6xl lg:text-[4.25rem] xl:text-[5rem]"
          >
            {profile.name}
          </h1>

          <motion.p {...enter(0.08)} className="mt-5 font-mono text-base text-muted sm:text-lg md:text-xl">
            {l(profile.role).map((part, index) =>
              part.domain ? (
                <span key={index} className="font-semibold" style={{ color: domainColor(part.domain) }}>
                  {part.text}
                </span>
              ) : (
                <span key={index}>{part.text}</span>
              ),
            )}
          </motion.p>

          <motion.p
            {...enter(0.16)}
            className="mt-6 font-display text-[1.375rem] font-semibold leading-snug tracking-tight text-fg sm:mt-8 sm:text-3xl md:text-[2.25rem] md:leading-tight"
          >
            {t.hero.statement.map((part, index) =>
              part.domain ? (
                <span
                  key={index}
                  style={accentStyle(part.domain)}
                  onMouseEnter={() => fieldBus.emit(part.domain ?? null)}
                  onMouseLeave={() => fieldBus.emit(null)}
                  className="relative inline-block cursor-default text-fg transition-colors duration-200 hover:text-accent"
                >
                  {part.text}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left rounded-full bg-accent opacity-70"
                  />
                </span>
              ) : (
                <span key={index} className="text-muted">
                  {part.text}
                </span>
              ),
            )}
          </motion.p>

          <motion.p {...enter(0.24)} className="mt-5 max-w-xl text-base text-muted sm:text-lg">
            {t.hero.intro}
          </motion.p>

          <motion.div {...enter(0.32)} className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9">
            <ButtonLink
              href="/#projects"
              variant="primary"
              size="lg"
              onClick={(event) => {
                if (scrollToSection("projects")) event.preventDefault();
              }}
            >
              {t.hero.explore}
              <Icon name="arrowRight" size={16} />
            </ButtonLink>
            <CvButton size="lg" />
          </motion.div>

          <motion.div {...enter(0.4)} className="mt-8 flex items-center gap-4">
            <SocialIcons kinds={["github", "linkedin", "email"]} className="-ml-2.5" />
            <PaletteHint className="hidden md:inline-flex" />
          </motion.div>
        </div>

        <motion.div {...enter(0.1)} className="order-1 lg:order-2">
          <Portrait />
        </motion.div>
      </div>

      {!calm && (
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.3em] text-subtle [@media(min-height:720px)]:flex"
        >
          {t.hero.scroll}
          <span className="relative h-10 w-px overflow-hidden bg-line">
            <motion.span
              className="absolute inset-x-0 top-0 h-4 bg-accent"
              animate={{ y: [-16, 40] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
            />
          </span>
        </div>
      )}
    </section>
  );
}
