import type { SkillGroup } from "./types";

/**
 * Grouped, not rated. The spec's original list, plus tools that the projects on
 * this page actually use. Remove anything you would not be comfortable
 * discussing in an interview.
 */
export const skills: SkillGroup[] = [
  {
    id: "ai",
    domain: "ai",
    title: { en: "AI / Machine Learning", vi: "AI / Học máy" },
    items: [
      "Python",
      "PyTorch",
      "scikit-learn",
      "Machine Learning",
      "Deep Learning",
      "Reinforcement Learning",
      "NLP",
      "LLM",
      "RAG",
      "Ollama",
      "Whisper",
    ],
  },
  {
    id: "research",
    domain: "research",
    title: { en: "Research", vi: "Nghiên cứu" },
    items: [
      "Quantum Computing",
      "VQE",
      "QAOA",
      "Variational Quantum Circuits",
      "Quantum Machine Learning",
      "Qiskit",
      "PennyLane",
      "PySCF",
      "Perceval (Quandela)",
      "Bayesian Optimization",
      "Scientific Computing",
      "SPSS / AMOS",
    ],
  },
  {
    id: "automation",
    domain: "automation",
    title: { en: "Automation", vi: "Tự động hoá" },
    items: ["Workflow Automation", "AI Tools", "Data Pipelines", "API Integration", "FFmpeg", "Playwright", "Web Crawling"],
  },
  {
    id: "data",
    domain: "data",
    title: { en: "Data", vi: "Dữ liệu" },
    items: ["Python", "NumPy", "SciPy", "Pandas", "SQL", "SQLite", "Data Analysis", "Visualization", "Plotly"],
  },
  {
    id: "software",
    title: { en: "Software", vi: "Phần mềm" },
    items: [
      "TypeScript",
      "Next.js",
      "React",
      "NestJS",
      "Node.js",
      "FastAPI",
      "Backend / API",
      "PostgreSQL",
      "TypeORM",
      "Streamlit",
      "pytest",
      "Git",
    ],
  },
  {
    id: "seo",
    domain: "seo",
    title: { en: "SEO / Marketing", vi: "SEO / Marketing" },
    items: ["SEO", "Keyword Research", "Search Intent", "Content Strategy", "Analytics"],
  },
];
