"use client";
import { Desktop } from "@/components/desktop/Desktop";
import { useUIStore } from "@/stores/uiStore";
import { LoginTerminal } from "./LoginTerminal";

export function Boot() {
  const bootPhase = useUIStore((s) => s.bootPhase);
  const setBootPhase = useUIStore((s) => s.setBootPhase);

  if (bootPhase === "locked") return <LoginTerminal />;

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
