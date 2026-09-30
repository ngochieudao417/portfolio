import fs from "node:fs";
import path from "node:path";

/**
 * Server-only: lists files in /public at build time so the UI can show
 * intentional placeholders (instead of broken images or 404 downloads) for
 * assets that haven't been added yet — the portrait, the CV, badges, screenshots.
 */
export function listPublicAssets(): string[] {
  const root = path.join(process.cwd(), "public");
  try {
    const entries = fs.readdirSync(root, { recursive: true, encoding: "utf8" });
    return entries
      .map((entry) => "/" + entry.split(path.sep).join("/"))
      .filter((entry) => /\.[a-z0-9]+$/i.test(entry) && !entry.endsWith(".gitkeep"));
  } catch {
    return [];
  }
}
