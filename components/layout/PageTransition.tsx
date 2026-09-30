"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

// The first render (server + hydration) is never animated, so the initial page
// paints immediately (good LCP). Client-side navigations fade in.
let hasHydrated = false;

export function PageTransition({ children }: { children: ReactNode }) {
  const [animateIn] = useState(() => hasHydrated);

  useEffect(() => {
    hasHydrated = true;
  }, []);

  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
