"use client";
import { Desktop } from "@/components/desktop/Desktop";
import { useUIStore } from "@/stores/uiStore";
import { BootScreen } from "./BootScreen";
import { BOOT_LINES, BootSequence } from "./BootSequence";
import { LoginTerminal } from "./LoginTerminal";

export function Boot() {
  const bootPhase = useUIStore((s) => s.bootPhase);

  if (bootPhase === "locked") return <LoginTerminal />;
  if (bootPhase === "booting") return <BootSequence />;
  return (
    <>
      <Desktop />
      <BootScreen
        lines={BOOT_LINES}
        className="boot-fade pointer-events-none fixed inset-0 z-50"
      />
    </>
  );
}
