"use client";

import Image from "next/image";
import { useAsset } from "@/components/layout/AssetsProvider";
import type { ImageAsset } from "@/content/types";
import { useI18n } from "@/lib/i18n/I18nProvider";

function Shot({ image }: { image: ImageAsset }) {
  const { l } = useI18n();
  const src = useAsset(image.src);
  if (!src) return null;
  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-surface-2">
      <div className="relative aspect-[16/10]">
        <Image src={src} alt={l(image.alt)} fill sizes="(min-width: 768px) 420px, 100vw" className="object-cover" />
      </div>
      <figcaption className="border-t border-line px-3 py-2 text-xs text-muted">{l(image.alt)}</figcaption>
    </figure>
  );
}

export function Screenshots({ images }: { images: ImageAsset[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {images.map((image) => (
        <Shot key={image.src} image={image} />
      ))}
    </div>
  );
}
