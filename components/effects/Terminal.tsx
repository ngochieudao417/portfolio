"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { profile } from "@/content/profile";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { closeOverlays } from "@/lib/ui-state";
import { cn } from "@/lib/utils/cn";
import { COMMANDS, openTargets, runCommand, type LineTone, type TerminalLine } from "./terminal-commands";
import { useLabActions } from "./useLabActions";

const TONES: Record<LineTone, string> = {
  input: "text-fg",
  output: "text-fg/85",
  muted: "text-subtle",
  accent: "text-[var(--accent-seo)]",
  error: "text-danger",
};

const PROMPT = `${profile.handle}@lab:~$`;

/** Hidden terminal — open with ` (backtick) or from the command palette. */
export default function Terminal({ open }: { open: boolean }) {
  const { t, l } = useI18n();
  const actions = useLabActions();
  const [lines, setLines] = useState<Array<TerminalLine & { id: number }>>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const push = (items: TerminalLine[]) =>
    setLines((current) => [...current, ...items.map((item) => ({ ...item, id: nextId.current++ }))]);

  useEffect(() => {
    if (open && lines.length === 0) push([{ tone: "muted", text: t.terminal.welcome }]);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const submit = () => {
    const command = input.trim();
    setInput("");
    setCursor(null);
    push([{ tone: "input", text: `${PROMPT} ${command}` }]);
    if (!command) return;
    setHistory((current) => [...current.filter((item) => item !== command), command].slice(-50));

    const result = runCommand(command, { t, l, actions });
    if (result.clear) setLines([]);
    else push(result.lines);
    if (result.close) {
      window.setTimeout(() => {
        closeOverlays();
        result.after?.();
      }, result.lines.length ? 700 : 0);
    } else {
      result.after?.();
    }
  };

  const complete = () => {
    const [name = "", arg] = input.split(/\s+/);
    const pool = arg === undefined ? [...COMMANDS] : name === "open" ? openTargets() : [];
    const prefix = arg === undefined ? name : arg;
    const found = pool.filter((item) => item.startsWith(prefix.toLowerCase()));
    if (found.length === 1) setInput(arg === undefined ? `${found[0]} ` : `${name} ${found[0]}`);
    else if (found.length > 1) push([{ tone: "muted", text: found.join("  ") }]);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    } else if (event.key === "Tab") {
      event.preventDefault();
      complete();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setInput(history[next] ?? "");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (cursor === null) return;
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setInput("");
      } else {
        setCursor(next);
        setInput(history[next] ?? "");
      }
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setLines([]);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={closeOverlays}
      label={t.terminal.label}
      initialFocus={inputRef}
      placement="top"
      className="w-full max-w-2xl overflow-hidden rounded-xl border border-line-strong bg-bg text-fg shadow-card"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-xs text-subtle">
          <Icon name="terminal" size={14} />
          {t.terminal.title}
        </span>
        <button
          type="button"
          onClick={closeOverlays}
          aria-label={t.common.close}
          className="grid size-7 place-items-center rounded-md text-subtle transition-colors hover:text-fg"
        >
          <Icon name="close" size={15} />
        </button>
      </div>

      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="scroll-thin h-[min(60vh,24rem)] overflow-y-auto px-4 py-3 font-mono text-[0.8125rem] leading-6"
      >
        <div role="log" aria-live="polite" aria-label={t.terminal.label}>
          {lines.map((line) => (
            <p key={line.id} className={cn("whitespace-pre-wrap break-words", TONES[line.tone])}>
              {line.text}
            </p>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="shrink-0 text-[var(--accent-seo)]">
            {PROMPT}
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            aria-label={t.terminal.inputLabel}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-inherit caret-[var(--accent-seo)] focus:outline-none"
          />
        </div>
      </div>
    </Dialog>
  );
}
