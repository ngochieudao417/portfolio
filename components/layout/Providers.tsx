"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { RecruiterModeProvider, useRecruiterMode } from "@/components/recruiter-mode/RecruiterModeProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { AssetsProvider } from "./AssetsProvider";

function MotionPreferences({ children }: { children: ReactNode }) {
  const { enabled } = useRecruiterMode();
  // Recruiter mode behaves like prefers-reduced-motion for every Framer animation.
  return <MotionConfig reducedMotion={enabled ? "always" : "user"}>{children}</MotionConfig>;
}

export function Providers({ publicAssets, children }: { publicAssets: string[]; children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <RecruiterModeProvider>
          <AssetsProvider files={publicAssets}>
            <MotionPreferences>{children}</MotionPreferences>
          </AssetsProvider>
        </RecruiterModeProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
