"use client";
import { useState } from "react";
import { TerminalInput } from "@/components/TerminalInput";
import { useUIStore } from "@/stores/uiStore";

const PASSPHRASE = "ssh aleckos";

export function LoginTerminal() {
  const setBootPhase = useUIStore((s) => s.setBootPhase);
  const [input, setInput] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    setInput("");

    if (cmd === PASSPHRASE) {
      setBootPhase("booting");
      return;
    }

    // show an error line for wrong input
  }

  return (
    <label
      className="block h-screen w-screen bg-black p-4 text-sm"
      htmlFor="login-input"
    >
      <p className="">hint: type 'ssh aleckos'</p>

      {/* render error lines here */}

      <form onSubmit={submit} className="flex">
        <span className="">$&nbsp;</span>
        <TerminalInput id="login-input" value={input} onChange={setInput} />
      </form>
    </label>
  );
}
