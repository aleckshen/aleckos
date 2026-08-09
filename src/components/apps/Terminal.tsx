"use client";
import { useEffect, useRef, useState } from "react";
import { useUIStore } from "@/stores/uiStore";
import { runCommand } from "@/lib/commands";

const motd = `aleck-os v1.0 — type 'help' to get started.\n`;

export function Terminal() {
  const { terminalHistory, pushTerminalLine, clearTerminal, openWindow } =
    useUIStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [terminalHistory]);

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
  }

  return (
    <div
      className="h-full bg-terminal-bg p-3 text-sm"
      onClick={() => inputRef.current?.focus()}
      ref={scrollRef}
    >
      <pre className="whitespace-pre-wrap text-terminal-dim">{motd}</pre>
      {terminalHistory.map((line, i) => (
        <div key={i}>
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
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
