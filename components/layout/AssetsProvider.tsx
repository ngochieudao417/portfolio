"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

const AssetsContext = createContext<Set<string>>(new Set());

export function AssetsProvider({ files, children }: { files: string[]; children: ReactNode }) {
  const set = useMemo(() => new Set(files), [files]);
  return <AssetsContext.Provider value={set}>{children}</AssetsContext.Provider>;
}

/**
 * Returns `src` if the file exists in /public (or is a remote URL), otherwise null,
 * so callers can render an intentional placeholder instead of a broken asset.
 */
export function useAsset(src: string | null | undefined): string | null {
  const files = useContext(AssetsContext);
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return src;
  return files.has(src) ? src : null;
}
