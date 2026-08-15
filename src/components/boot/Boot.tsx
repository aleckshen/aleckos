"use client";
import { Desktop } from "@/components/desktop/Desktop";
import { useUIStore } from "@/stores/uiStore";
import { BootSequence } from "./BootSequence";
import { LoginTerminal } from "./LoginTerminal";

export function Boot() {
  const bootPhase = useUIStore((s) => s.bootPhase);

  if (bootPhase === "locked") return <LoginTerminal />;
  if (bootPhase === "booting") return <BootSequence />;
  return <Desktop />;
}
