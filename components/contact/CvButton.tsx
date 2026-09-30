"use client";

import { profile } from "@/content/profile";
import { useAsset } from "@/components/layout/AssetsProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface CvButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Icon-only (label kept for assistive tech) — used where navbar space is tight. */
  iconOnly?: boolean;
}

/**
 * "Download CV" when the PDF exists in /public; otherwise degrades to a
 * "Request CV" email (or the contact section) — never a broken download.
 */
export function CvButton({ variant = "secondary", size = "md", className, iconOnly = false }: CvButtonProps) {
  const { t } = useI18n();
  const cv = useAsset(profile.cv.src);

  const label = cv ? t.cv.download : t.cv.request;
  const content = (
    <>
      <Icon name={cv ? "download" : "mail"} size={16} />
      <span className={iconOnly ? "sr-only" : undefined}>{label}</span>
    </>
  );
  const classes = iconOnly ? `${className ?? ""} w-9 px-0!` : className;

  if (cv) {
    return (
      <ButtonLink
        href={cv}
        download={profile.cv.fileName}
        variant={variant}
        size={size}
        className={classes}
        title={iconOnly ? label : undefined}
      >
        {content}
      </ButtonLink>
    );
  }

  const href = profile.email
    ? `mailto:${profile.email}?subject=${encodeURIComponent(`${t.cv.requestSubject} — ${profile.name}`)}`
    : "/#contact";

  return (
    <ButtonLink href={href} variant={variant} size={size} className={classes} title={iconOnly ? label : undefined}>
      {content}
    </ButtonLink>
  );
}
