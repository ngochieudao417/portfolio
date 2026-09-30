"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { NAV_ITEMS } from "@/components/navigation/nav-items";
import { Dialog } from "@/components/ui/Dialog";
import { Icon, type IconName } from "@/components/ui/Icon";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { research } from "@/content/research";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { closeOverlays, openOverlay } from "@/lib/ui-state";
import { cn } from "@/lib/utils/cn";
import { useLabActions } from "./useLabActions";

type Group = "navigate" | "projects" | "actions" | "lab";

interface Command {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  icon: IconName;
  keywords?: string;
  run: () => void;
}

const GROUP_ORDER: Group[] = ["navigate", "projects", "actions", "lab"];

function matches(command: Command, query: string): boolean {
  const haystack = `${command.label} ${command.hint ?? ""} ${command.keywords ?? ""}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

/** ⌘K / Ctrl+K command palette. Loaded on first use. */
export default function CommandPalette({ open }: { open: boolean }) {
  const { t, l } = useI18n();
  const actions = useLabActions();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const commands = useMemo<Command[]>(() => {
    const a = t.palette.actions;
    const list: Command[] = [
      ...NAV_ITEMS.map((item) => ({
        id: `nav-${item.id}`,
        group: "navigate" as const,
        label: t.nav[item.key],
        hint: `#${item.id}`,
        icon: "arrowRight" as const,
        run: () => actions.navigateTo(`#${item.id}`),
      })),
      ...projects.map((project) => ({
        id: `project-${project.slug}`,
        group: "projects" as const,
        label: project.title,
        hint: l(project.category),
        icon: "briefcase" as const,
        keywords: project.tags.join(" "),
        run: () => actions.navigateTo(`/projects/${project.slug}`),
      })),
      ...research.map((entry) => ({
        id: `research-${entry.slug}`,
        group: "projects" as const,
        label: l(entry.title),
        hint: entry.code,
        icon: "flask" as const,
        run: () => actions.navigateTo(`/research/${entry.slug}`),
      })),
      { id: "theme", group: "actions", label: a.toggleTheme, icon: actions.theme === "dark" ? "sun" : "moon", keywords: "dark light mode", run: actions.toggleTheme },
      { id: "lang", group: "actions", label: a.toggleLanguage, icon: "sparkle", keywords: "language english vietnamese en vi", run: actions.toggleLocale },
      { id: "recruiter", group: "actions", label: a.toggleRecruiter, icon: "user", keywords: "recruiter hr fast", run: () => actions.setRecruiter(!actions.recruiter) },
      { id: "cv", group: "actions", label: actions.cvAvailable ? a.downloadCv : t.cv.request, icon: "download", keywords: "cv resume", run: actions.openCv },
    ];
    if (profile.email) list.push({ id: "email", group: "actions", label: a.copyEmail, hint: profile.email, icon: "copy", run: () => void actions.copyEmail() });
    if (profile.socials.github) list.push({ id: "github", group: "actions", label: a.openGithub, icon: "github", run: () => actions.openExternal(profile.socials.github) });
    if (profile.socials.linkedin) list.push({ id: "linkedin", group: "actions", label: a.openLinkedin, icon: "linkedin", run: () => actions.openExternal(profile.socials.linkedin) });
    list.push(
      { id: "terminal", group: "lab", label: a.openTerminal, hint: "`", icon: "terminal", keywords: "shell console", run: () => openOverlay("terminal") },
      { id: "measure", group: "lab", label: a.measure, hint: "|ψ⟩", icon: "atom", keywords: "quantum qubit collapse", run: () => void actions.measure() },
    );
    return list;
  }, [actions, l, t]);

  const filtered = useMemo(() => {
    const visible = query.trim() ? commands.filter((command) => matches(command, query)) : commands;
    return GROUP_ORDER.flatMap((group) => visible.filter((command) => command.group === group));
  }, [commands, query]);

  useEffect(() => {
    setActive((current) => Math.min(current, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const execute = (command: Command | undefined) => {
    if (!command) return;
    if (command.id !== "terminal") closeOverlays();
    command.run();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      execute(filtered[active]);
    }
  };

  const activeId = filtered[active] ? `${listId}-${filtered[active]!.id}` : undefined;
  let lastGroup: Group | null = null;

  return (
    <Dialog
      open={open}
      onClose={closeOverlays}
      label={t.palette.label}
      initialFocus={inputRef}
      placement="top"
      className="w-full max-w-xl overflow-hidden rounded-xl border border-line-strong bg-bg-elevated shadow-card"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Icon name="search" size={17} className="text-subtle" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={t.palette.placeholder}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-label={t.palette.label}
          className="h-14 flex-1 bg-transparent font-mono text-sm text-fg placeholder:text-subtle focus:outline-none"
        />
        <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[0.6875rem] text-subtle">esc</kbd>
      </div>

      <ul ref={listRef} id={listId} role="listbox" aria-label={t.palette.label} className="scroll-thin max-h-[min(60vh,26rem)] overflow-y-auto p-2">
        {filtered.length === 0 && <li className="px-3 py-8 text-center font-mono text-sm text-muted">{t.palette.empty}</li>}
        {filtered.map((command, index) => {
          const header = command.group !== lastGroup ? t.palette.groups[command.group] : null;
          lastGroup = command.group;
          const selected = index === active;
          return (
            <li key={command.id} role="presentation">
              {header && (
                <p role="presentation" className="px-3 pb-1 pt-3 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">
                  {header}
                </p>
              )}
              <div
                id={`${listId}-${command.id}`}
                role="option"
                aria-selected={selected}
                onMouseMove={() => setActive(index)}
                onClick={() => execute(command)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  selected ? "bg-surface-2 text-fg" : "text-muted",
                )}
              >
                <Icon name={command.icon} size={16} className={selected ? "text-[var(--accent-ai)]" : "text-subtle"} />
                <span className="min-w-0 flex-1 truncate">{command.label}</span>
                {command.hint && <span className="shrink-0 truncate font-mono text-xs text-subtle">{command.hint}</span>}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="border-t border-line px-4 py-2.5 font-mono text-[0.6875rem] text-subtle">{t.palette.hint}</p>
    </Dialog>
  );
}
