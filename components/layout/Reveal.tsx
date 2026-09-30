"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { useRecruiterMode } from "@/components/recruiter-mode/RecruiterModeProvider";

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  /** Vertical offset in px before reveal. */
  offset?: number;
  /** Render as a list item when revealing items inside <ul>/<ol>. */
  as?: "div" | "li";
}

/** Fade/slide in once when scrolled into view. Instant in recruiter mode. */
export function Reveal({ children, className, style, delay = 0, offset = 18, as = "div" }: RevealProps) {
  const { enabled: instant } = useRecruiterMode();
  const shown = { opacity: 1, y: 0 };
  const Component = as === "li" ? motion.li : motion.div;
  return (
    <Component
      className={className ? `reveal ${className}` : "reveal"}
      style={style}
      initial={{ opacity: 0, y: offset }}
      animate={instant ? shown : undefined}
      whileInView={instant ? undefined : shown}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={instant ? { duration: 0 } : { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}
