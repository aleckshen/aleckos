"use client";
import { useEffect, useState } from "react";
import { useUIStore } from "@/stores/uiStore";
import { BootScreen } from "./BootScreen";

export const BOOT_LINES = [
  "aleckOS BIOS v1.0",
  "Copyright (C) 2026, aleck shen",
  "",
  "CPU        : neural-core @ 3.20GHz",
  "Cores      : 8",
  "Memory Test: 16384MB OK",
  "",
  "Detecting primary master ....... aleckos-ssd",
  "Detecting primary slave  ....... none",
  "Detecting secondary master ..... none",
  "Detecting secondary slave  ..... none",
  "",
  "Initializing USB controllers ... done",
  "Initializing display adapter ... 1920x1080",
  "",
  "Press DEL to enter SETUP",
  "",
  "Booting from HDD ...",
  "",
  "Loading kernel ................. [  OK  ]",
  "Checking filesystem ............ [  OK  ]",
  "Mounting /home/guest ........... [  OK  ]",
  "Starting network services ...... [  OK  ]",
  "Starting window manager ........ [  OK  ]",
  "Starting terminal service ...... [  OK  ]",
  "Loading user profile ........... [  OK  ]",
  "",
  "aleckOS 1.0 guest tty1",
  "",
  "welcome, guest.",
];

/** Delay between each line appearing. */
const LINE_MS = 60;
/** Pause on the finished screen before handing over to the desktop. */
const HOLD_MS = 600;

export function BootSequence() {
  const setBootPhase = useUIStore((s) => s.setBootPhase);
  const openWindow = useUIStore((s) => s.openWindow);
  const [visible, setVisible] = useState(0);

  // Reveal one line at a time.
  useEffect(() => {
    const id = setInterval(() => {
      setVisible((n) => Math.min(n + 1, BOOT_LINES.length));
    }, LINE_MS);
    return () => clearInterval(id);
  }, []);

  // Any keypress or click skips ahead.
  useEffect(() => {
    const skip = () => setVisible(BOOT_LINES.length);
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, []);

  // Once everything is on screen, hold briefly then boot into the desktop.
  useEffect(() => {
    if (visible < BOOT_LINES.length) return;
    const id = setTimeout(() => {
      openWindow("terminal", "aleck's terminal", { maximized: true });
      setBootPhase("ready");
    }, HOLD_MS);
    return () => clearTimeout(id);
  }, [visible, openWindow, setBootPhase]);

  return <BootScreen lines={BOOT_LINES.slice(0, visible)} />;
}
