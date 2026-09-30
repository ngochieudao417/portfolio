import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { site } from "@/content/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DOMAIN_HEX = { ai: "#5b95ff", research: "#a78bfa", automation: "#ff8a3d", data: "#22d3ee", seo: "#4ade80" };

/** Fetches a Vietnamese-capable subset of JetBrains Mono at build time; null if offline. */
async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&text=${encodeURIComponent(text)}`,
    ).then((response) => response.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const font = await fetch(url);
    return font.ok ? await font.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const role = profile.role.en;
  const tagline = "Build. Research. Automate.";
  const ket = `|${profile.initials}⟩`;
  const location = "Hanoi, Vietnam";
  const font = await loadFont(`${profile.name}${role.map((part) => part.text).join("")}${tagline}${ket}${location}`);
  // Without the web font, fall back to ASCII so diacritics never render as tofu.
  const name = font ? profile.name : profile.asciiName;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a0b0d",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          color: "#ecebe8",
          fontFamily: font ? "JetBrains Mono" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, color: "#a0a5ad" }}>
          <span style={{ display: "flex", width: 14, height: 14, borderRadius: 999, background: DOMAIN_HEX.seo }} />
          {font ? ket : "Portfolio"}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1 }}>{name}</div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 38 }}>
            {role.map((part, index) => (
              <span key={index} style={{ color: part.domain ? DOMAIN_HEX[part.domain] : "#a0a5ad" }}>
                {part.text.replace(/ /g, " ")}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#a0a5ad" }}>
          <span>{tagline}</span>
          <span>{location}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "JetBrains Mono", data: font, weight: 700, style: "normal" }] : undefined,
    },
  );
}
