"use client";
import { useEffect, useRef, useState } from "react";
import { runCommand } from "@/lib/commands";
import { useUIStore } from "@/stores/uiStore";

const motd = `aleck-os v1.0 — type 'help' to get started.\n`;

export function Terminal() {
  const { terminalHistory, pushTerminalLine, clearTerminal, openWindow } =
    useUIStore();
  const [input, setInput] = useState("");
  const [caret, setCaret] = useState(0);
  const scrollRef = useRef<HTMLLabelElement>(null);

  function syncCaret(el: HTMLInputElement) {
    setCaret(el.selectionStart ?? el.value.length);
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = runCommand(input);
    if (result.kind === "clear") {
      clearTerminal();
    } else if (result.kind === "open") {
      const titles = {
        about: "About",
        projects: "Projects",
        experience: "Experience",
      };
      openWindow(result.app, titles[result.app]);
      pushTerminalLine({ input, output: `opening ${result.app}...` });
    } else {
      pushTerminalLine({ input, output: result.output });
    }
    setInput("");
    setCaret(0);
  }

  return (
    <label
      className="block h-full overflow-y-auto bg-terminal-bg p-3 text-sm"
      htmlFor="terminal-input"
      ref={scrollRef}
    >
      <pre className="whitespace-pre-wrap text-terminal-dim">{motd}</pre>
      {terminalHistory.map((line) => (
        <div key={line.id}>
          <div>
            <span className="text-terminal-accent">guest@aleck-os</span>
            <span className="text-terminal-dim">:~$ </span>
            <span>{line.input}</span>
          </div>
          {line.output && (
            <pre className="whitespace-pre-wrap">{line.output}</pre>
          )}
        </div>
      ))}
      <form onSubmit={submit} className="flex">
        <span className="text-terminal-accent">guest@aleck-os</span>
        <span className="text-terminal-dim">:~$&nbsp;</span>
        <span className="relative h-5 flex-1">
          <input
            id="terminal-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              syncCaret(e.target);
            }}
            onClick={(e) => syncCaret(e.currentTarget)}
            onKeyUp={(e) => syncCaret(e.currentTarget)}
            onSelect={(e) => syncCaret(e.currentTarget)}
            className="peer w-full bg-transparent caret-transparent outline-none"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <span
            aria-hidden="true"
            className="cursor-blink invisible pointer-events-none absolute top-1/2 h-4 w-[0.75ch] -translate-y-1/2 bg-terminal-fg peer-focus:visible"
            style={{ left: `${caret}ch` }}
          />
        </span>
      </form>
    </label>
  );
}
