"use client";
import { useUIStore } from "@/stores/uiStore";
import { Desktop } from "./Desktop";

export function Boot() {
  const bootPhase = useUIStore((s) => s.bootPhase);
  const setBootPhase = useUIStore((s) => s.setBootPhase);

  // TODO: replace with <LoginTerminal />
  if (bootPhase === "locked") {
    return (
      <div className="h-screen w-screen bg-black p-4 text-sm text-terminal-fg">
        <p>locked</p>
        <button
          type="button"
          className="mt-2 text-terminal-accent underline"
          onClick={() => setBootPhase("booting")}
        >
          boot →
        </button>
      </div>
    );
  }

  // TODO: replace with <BootSequence />
  if (bootPhase === "booting") {
    return (
      <div className="h-screen w-screen bg-black p-4 text-sm text-terminal-fg">
        <p>booting...</p>
        <button
          type="button"
          className="mt-2 text-terminal-accent underline"
          onClick={() => setBootPhase("ready")}
        >
          finish →
        </button>
      </div>
    );
  }

  return <Desktop />;
}
