"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CvButton } from "@/components/contact/CvButton";
import { useNavigateTo } from "@/components/navigation/useNavigateTo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useRecruiterMode } from "./RecruiterModeProvider";

/** Recruiter mode keeps CV + Contact one tap away at all times. */
export function RecruiterDock() {
  const { enabled } = useRecruiterMode();
  const { t } = useI18n();
  const navigateTo = useNavigateTo();

  return (
    <AnimatePresence>
      {enabled && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/90 p-3 backdrop-blur-md md:inset-x-auto md:bottom-5 md:right-5 md:rounded-xl md:border md:p-2 md:shadow-card"
        >
          <div className="flex items-center gap-2 [&>*]:flex-1 md:[&>*]:flex-none">
            <CvButton variant="primary" size="md" />
            <Button variant="secondary" size="md" onClick={() => navigateTo("#contact")}>
              <Icon name="mail" size={16} />
              {t.contact.contactMe}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
