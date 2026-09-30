import { NAV_ITEMS } from "@/components/navigation/nav-items";
import { certifications } from "@/content/certifications";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { research } from "@/content/research";
import type { Dictionary } from "@/content/translations";
import type { Localized } from "@/content/types";
import { LAB_STATES } from "@/lib/quantum";
import type { LabActions } from "./useLabActions";

export type LineTone = "input" | "output" | "muted" | "accent" | "error";

export interface TerminalLine {
  tone: LineTone;
  text: string;
}

export interface CommandResult {
  lines: TerminalLine[];
  clear?: boolean;
  close?: boolean;
  /** Runs after the output is printed (e.g. navigation). */
  after?: () => void;
}

interface Context {
  t: Dictionary;
  l: <T>(value: Localized<T>) => T;
  actions: LabActions;
}

export const COMMANDS = [
  "help",
  "whoami",
  "about",
  "ls",
  "open",
  "cv",
  "contact",
  "theme",
  "lang",
  "recruiter",
  "measure",
  "clear",
  "exit",
] as const;

type CommandName = (typeof COMMANDS)[number];

const out = (text: string): TerminalLine => ({ tone: "output", text });
const muted = (text: string): TerminalLine => ({ tone: "muted", text });
const accent = (text: string): TerminalLine => ({ tone: "accent", text });
const error = (text: string): TerminalLine => ({ tone: "error", text });

/** Completion candidates for the argument of `open`. */
export function openTargets(): string[] {
  return [...projects.map((p) => p.slug), ...research.map((r) => `research/${r.slug}`), ...NAV_ITEMS.map((n) => n.id)];
}

export function runCommand(input: string, { t, l, actions }: Context): CommandResult {
  const [rawName = "", ...args] = input.trim().split(/\s+/);
  const name = rawName.toLowerCase();
  const arg = (args[0] ?? "").toLowerCase();
  const T = t.terminal;

  if (!name) return { lines: [] };

  if (name === "sudo") {
    if (args.join(" ").toLowerCase() === "hire-me") {
      return {
        lines: T.hireMe.split("\n").map((line, i) => (i === 0 ? muted(line) : accent(line))),
        close: true,
        after: () => actions.navigateTo("#contact"),
      };
    }
    return { lines: [error(`sudo: ${T.notFound}: ${args.join(" ")}`), muted(T.tryHelp)] };
  }

  if (!(COMMANDS as readonly string[]).includes(name)) {
    return { lines: [error(`${name}: ${T.notFound}`), muted(T.tryHelp)] };
  }

  switch (name as CommandName) {
    case "help":
      return {
        lines: COMMANDS.map((command) => out(`${command.padEnd(11)}${T.help[command]}`)),
      };

    case "whoami":
      return {
        lines: [accent(profile.name), out(l(profile.roleText)), muted(`${l(profile.location)} · ${profile.coordinates}`)],
      };

    case "about":
      return {
        lines: t.about.story.flatMap((step, i) => [
          accent(`${String(i + 1).padStart(2, "0")} ${step.label}`),
          out(step.text),
        ]),
      };

    case "ls": {
      if (arg === "projects" || arg === "projects/") {
        return { lines: projects.map((p) => out(`${p.slug.padEnd(22)}${p.title}`)) };
      }
      if (arg === "research" || arg === "research/") {
        return { lines: research.map((r) => out(`${r.slug.padEnd(22)}${l(r.title)}`)) };
      }
      if (arg === "certs" || arg === "certs/") {
        return { lines: certifications.map((c) => out(`${c.name.padEnd(12)}${c.issuer} · ${c.year}`)) };
      }
      return { lines: [accent("projects/  research/  certs/")] };
    }

    case "open": {
      if (!arg) return { lines: [muted(`${T.usage}: open <${openTargets().slice(0, 3).join(" | ")} | …>`)] };
      const target = arg.replace(/^#/, "").replace(/\/$/, "");
      const project = projects.find((p) => p.slug === target);
      const entry = research.find((r) => r.slug === target.replace(/^research\//, ""));
      const section = NAV_ITEMS.find((n) => n.id === target || t.nav[n.key].toLowerCase() === target);
      const href = project
        ? `/projects/${project.slug}`
        : target.startsWith("research/") && entry
          ? `/research/${entry.slug}`
          : section
            ? `#${section.id}`
            : entry
              ? `/research/${entry.slug}`
              : null;
      if (!href) return { lines: [error(`${T.unknownTarget} "${arg}"`), muted(`ls projects · ls research`)] };
      return { lines: [muted(`${T.opening} ${href} …`)], close: true, after: () => actions.navigateTo(href) };
    }

    case "cv":
      return { lines: [muted(`${actions.cvAvailable ? t.cv.download : t.cv.request} …`)], after: actions.openCv };

    case "contact": {
      const rows = [
        profile.email && `email     ${profile.email}`,
        profile.phone && `phone     ${profile.phone}`,
        profile.socials.linkedin && `linkedin  ${profile.socials.linkedin}`,
        profile.socials.github && `github    ${profile.socials.github}`,
      ].filter((row): row is string => Boolean(row));
      return { lines: rows.length ? rows.map(out) : [muted(T.noContact)] };
    }

    case "theme": {
      if (arg && arg !== "dark" && arg !== "light") return { lines: [muted(`${T.usage}: theme dark | light`)] };
      const next = arg === "dark" || arg === "light" ? arg : actions.theme === "dark" ? "light" : "dark";
      return { lines: [out(`theme → ${next}`)], after: () => actions.setTheme(next) };
    }

    case "lang": {
      if (arg && arg !== "en" && arg !== "vi") return { lines: [muted(`${T.usage}: lang en | vi`)] };
      const next = arg === "en" || arg === "vi" ? arg : actions.locale === "en" ? "vi" : "en";
      return { lines: [out(`lang → ${next}`)], after: () => actions.setLocale(next) };
    }

    case "recruiter": {
      if (arg && arg !== "on" && arg !== "off") return { lines: [muted(`${T.usage}: recruiter on | off`)] };
      const next = arg ? arg === "on" : !actions.recruiter;
      return { lines: [out(`recruiter → ${next ? "on" : "off"}`)], after: () => actions.setRecruiter(next) };
    }

    case "measure": {
      const outcome = actions.measure();
      const amplitude = (1 / LAB_STATES.length).toFixed(2);
      return {
        lines: [
          muted(T.measurePrep),
          ...LAB_STATES.map((state) => out(`|${state.label}⟩`.padEnd(13) + "█".repeat(10) + `  ${amplitude}`)),
          accent(`${T.measureResult} |${outcome.label}⟩`),
        ],
      };
    }

    case "clear":
      return { lines: [], clear: true };

    case "exit":
      return { lines: [], close: true };
  }
}
