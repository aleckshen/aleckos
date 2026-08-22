"use client";
import { useState } from "react";
import { TerminalInput } from "@/components/ui/TerminalInput";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import { useUIStore } from "@/stores/uiStore";

const PASSPHRASE = "ssh aleckos";
const PROMPT = "guest@unknown-os:~$";

type Line = { id: string; input: string; output: string };

export function LoginTerminal() {
  const setBootPhase = useUIStore((s) => s.setBootPhase);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Line[]>([]);
  const scrollRef = useScrollToBottom<HTMLLabelElement>();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    setInput("");

    if (cmd === PASSPHRASE) {
      setBootPhase("booting");
      return;
    }

    if (cmd === "clear") {
      setHistory([]);
      return;
    }

    // An empty submit just echoes a blank prompt line, same as the terminal.
    const output =
      cmd === "" ? "" : `command not found: ${cmd.split(/\s+/)[0]}`;
    setHistory((prev) => [
      ...prev,
      { id: crypto.randomUUID(), input: cmd, output },
    ]);
  }

  return (
    <label
      // text-base on mobile: iOS zooms in on focus when inputs are under 16px.
      className="block h-dvh w-screen overflow-y-auto bg-black p-4 text-base md:text-sm"
      htmlFor="boot-input"
      ref={scrollRef}
    >
      <p className="">hint: type 'ssh aleckos'</p>

      {history.map((line) => (
        <div key={line.id}>
          <div className="break-words">
            <span className="whitespace-nowrap">{PROMPT}&nbsp;</span>
            <span>{line.input}</span>
          </div>
          {line.output && (
            <pre className="whitespace-pre-wrap break-words">{line.output}</pre>
          )}
        </div>
      ))}

      <form onSubmit={submit} className="flex">
        <span className="shrink-0 whitespace-nowrap">{PROMPT}&nbsp;</span>
        <TerminalInput
          id="boot-input"
          value={input}
          onChange={setInput}
          focusOnMount
        />
      </form>
    </label>
  );
}
