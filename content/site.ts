export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  title: "Đào Ngọc Hiếu — AI / R&D / Automation Engineer",
  shortTitle: "Đào Ngọc Hiếu",
  description:
    "Đào Ngọc Hiếu is an AI / R&D / Automation Engineer in Hanoi, Vietnam — building LLM/RAG systems, researching hybrid quantum–classical machine learning, and automating data workflows.",
  keywords: [
    "Đào Ngọc Hiếu",
    "Dao Ngoc Hieu",
    "AI Engineer",
    "R&D Engineer",
    "Automation Engineer",
    "RAG",
    "LLM",
    "Quantum Machine Learning",
    "VQE",
    "Hanoi",
  ],
  copyrightYear: 2026,
  /** Show "// TODO" markers for missing content. Always on in `next dev`. */
  showPlaceholders:
    process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "true",
} as const;
