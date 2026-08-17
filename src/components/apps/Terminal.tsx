"use client";
import { useState } from "react";
import { TerminalInput } from "@/components/ui/TerminalInput";
import { documents } from "@/content/documents";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import { runCommand } from "@/lib/commands";
import { useUIStore } from "@/stores/uiStore";

const motd = `aleck-os v1.0 — type 'help' to get started.\n`;

export function Terminal() {
  const { terminalHistory, pushTerminalLine, clearTerminal, openWindow } =
    useUIStore();
  const [input, setInput] = useState("");
  const scrollRef = useScrollToBottom<HTMLLabelElement>();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = runCommand(input);
    if (result.kind === "clear") {
      clearTerminal();
    } else if (result.kind === "open") {
      const doc = documents.find((d) => d.id === result.app);
      openWindow(result.app, doc?.title ?? result.app);
      pushTerminalLine({ input, output: `opening ${result.app}...` });
    } else if (result.kind === "external") {
      window.open(result.url, "_blank");
      pushTerminalLine({ input, output: `opening ${result.file}...` });
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
          <div className="break-words">
            <span className="whitespace-nowrap">
              <span className="text-terminal-accent">guest@aleck-os</span>
              <span className="text-terminal-dim">:~$ </span>
            </span>
            <span>{line.input}</span>
          </div>
          {line.output && (
            <pre className="whitespace-pre-wrap break-words">{line.output}</pre>
          )}
        </div>
      ))}
      <form onSubmit={submit} className="flex">
        <span className="shrink-0 whitespace-nowrap text-terminal-accent">
          guest@aleck-os
        </span>
        <span className="shrink-0 whitespace-nowrap text-terminal-dim">
          :~$&nbsp;
        </span>
        <TerminalInput
          id="terminal-input"
          value={input}
          onChange={setInput}
          focusOnMount
        />
      </form>
    </label>
  );
}
