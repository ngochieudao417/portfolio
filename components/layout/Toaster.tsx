"use client";

import { AnimatePresence, motion } from "framer-motion";
import { toastStore } from "@/lib/ui-state";
import { accentStyle } from "@/lib/utils/domains";
import { useStore } from "@/lib/utils/store";

export function Toaster() {
  const toast = useStore(toastStore);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[150] flex justify-center px-4 md:bottom-8"
    >
      <AnimatePresence>
        {toast && (
          <motion.p
            key={toast.id}
            style={accentStyle(toast.accent)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="flex max-w-md items-center gap-3 rounded-lg border border-line-strong bg-bg-elevated/95 px-4 py-2.5 font-mono text-sm text-fg shadow-card backdrop-blur"
          >
            <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {toast.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
