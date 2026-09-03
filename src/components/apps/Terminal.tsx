"use client";
import { Fragment, useState } from "react";
import { TerminalInput } from "@/components/ui/TerminalInput";
import { documents } from "@/content/documents";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import { COMMANDS, runCommand } from "@/lib/commands";
import { useUIStore } from "@/stores/uiStore";

const motd = `aleck-os v1.0 — type 'help' to get started.\n`;

/** Lets the "opening ..." line land before the window appears. */
const OPEN_DELAY_MS = 750;

/**
 * Real grid columns rather than space-padded text: a description too long for
 * the window wraps within its own column instead of back to the left margin.
 */
function CommandList() {
  return (
    <div>
      <p>Available commands:</p>
      <div className="grid grid-cols-[auto_1fr] gap-x-[3ch] pl-[2ch]">
        {COMMANDS.map((c) => (
          <Fragment key={c.name}>
            <span className="whitespace-nowrap">
              {c.arg ? `${c.name} ${c.arg}` : c.name}
            </span>
            <span className="min-w-0 break-words">{c.description}</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function Terminal() {
  const {
    terminalHistory,
    pushTerminalLine,
    clearTerminal,
    openWindow,
    closeWindow,
  } = useUIStore();
  const [input, setInput] = useState("");
  const scrollRef = useScrollToBottom<HTMLLabelElement>();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = runCommand(input);
    if (result.kind === "clear") {
      clearTerminal();
    } else if (result.kind === "close") {
      closeWindow("terminal");
    } else if (result.kind === "help") {
      pushTerminalLine({ input, output: { kind: "help" } });
    } else if (result.kind === "open") {
      const doc = documents.find((d) => d.id === result.app);
      pushTerminalLine({
        input,
        output: { kind: "text", text: `opening ${result.app}...` },
      });
      // Fires even if the terminal is closed meanwhile: the command was
      // issued, and openWindow is store state rather than component state.
      setTimeout(
        () => openWindow(result.app, doc?.title ?? result.app),
        OPEN_DELAY_MS,
      );
    } else if (result.kind === "external") {
      window.open(result.url, "_blank");
      pushTerminalLine({
        input,
        output: { kind: "text", text: `opening ${result.file}...` },
      });
    } else {
      pushTerminalLine({
        input,
        output: { kind: "text", text: result.output },
      });
    }
    setInput("");
  }

  return (
    <label
      // text-base on mobile: iOS zooms in on focus when inputs are under 16px.
      className="block h-full overflow-y-auto bg-terminal-bg p-3 text-base md:text-sm"
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
          {line.output.kind === "help" ? (
            <CommandList />
          ) : (
            line.output.text && (
              <pre className="whitespace-pre-wrap break-words">
                {line.output.text}
              </pre>
            )
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
