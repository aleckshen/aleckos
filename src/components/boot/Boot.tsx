"use client";
import { useEffect, useState } from "react";
import { Desktop } from "@/components/desktop/Desktop";
import { useUIStore } from "@/stores/uiStore";
import { BootScreen } from "./BootScreen";
import { BOOT_LINES, BootSequence } from "./BootSequence";
import { LoginTerminal } from "./LoginTerminal";

export function Boot() {
  const bootPhase = useUIStore((s) => s.bootPhase);
  const hydrated = useUIStore((s) => s.hydrated);
  const hydrate = useUIStore((s) => s.hydrate);
  // Only a session that actually watched the BIOS screen should see it fade;
  // a restored desktop skips straight past it.
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (bootPhase === "booting") setBooted(true);
  }, [bootPhase]);

  // Until localStorage has been read the phase isn't known, and guessing would
  // flash the login screen at someone already logged in. Black matches both the
  // login and BIOS screens, so the wait doesn't read as a blank frame.
  if (!hydrated) return <div className="h-dvh w-screen bg-black" />;

  if (bootPhase === "locked") return <LoginTerminal />;
  if (bootPhase === "booting") return <BootSequence />;
  return (
    <>
      <Desktop />
      {booted && (
        <BootScreen
          lines={BOOT_LINES}
          className="boot-fade pointer-events-none fixed inset-0 z-50"
        />
      )}
    </>
  );
}
