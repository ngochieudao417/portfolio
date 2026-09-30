"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useAsset } from "@/components/layout/AssetsProvider";
import type { ImageAsset } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils/cn";
import { Dialog } from "./Dialog";
import { Icon } from "./Icon";

interface ZoomableImageProps {
  image: ImageAsset;
  /** Sizing / aspect classes for the thumbnail frame. */
  className?: string;
  sizes: string;
  fit?: "cover" | "contain";
  /** CSS object-position for the thumbnail crop, e.g. "top". */
  position?: string;
  /** Always-visible label on the thumbnail, e.g. "View diploma". */
  hint?: string;
}

/**
 * Thumbnail that opens the full image in an accessible lightbox.
 * Renders nothing if the file isn't in /public yet.
 */
export function ZoomableImage({ image, className, sizes, fit = "cover", position = "center", hint }: ZoomableImageProps) {
  const { t, l } = useI18n();
  const src = useAsset(image.src);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  if (!src) return null;
  const alt = l(image.alt);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={cn(
          "group relative block w-full overflow-hidden rounded-lg border border-line bg-surface-2 text-left",
          className,
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          style={{ objectPosition: position }}
          className={cn(
            "transition-transform duration-500 group-hover:scale-[1.03]",
            fit === "cover" ? "object-cover" : "object-contain",
          )}
        />
        {hint ? (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-md border border-line bg-bg/85 px-2 py-1 font-mono text-xs text-fg backdrop-blur">
            <Icon name="search" size={13} />
            {hint}
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-md bg-bg/85 text-fg opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <Icon name="search" size={15} />
          </span>
        )}
        <span className="sr-only">{t.common.viewFull}</span>
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        label={alt}
        initialFocus={closeRef}
        className="flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-line-strong bg-bg shadow-card sm:max-h-[94vh] sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-4 py-2.5">
          <p className="truncate text-sm text-muted">{alt}</p>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t.common.close}
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:text-fg"
          >
            <Icon name="close" size={17} />
          </button>
        </div>
        <div className="relative h-[80dvh] w-full bg-surface-2 sm:h-[84vh]">
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-contain" />
        </div>
      </Dialog>
    </>
  );
}
