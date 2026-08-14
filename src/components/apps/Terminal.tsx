"use client";
import { useEffect, useRef, useState } from "react";
import { TerminalInput } from "@/components/ui/TerminalInput";
import { runCommand } from "@/lib/commands";
import { useUIStore } from "@/stores/uiStore";

const motd = `aleck-os v1.0 — type 'help' to get started.\n`;

export function Terminal() {
  const { terminalHistory, pushTerminalLine, clearTerminal, openWindow } =
    useUIStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLLabelElement>(null);

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
        <TerminalInput id="terminal-input" value={input} onChange={setInput} />
      </form>
    </label>
  );
}
