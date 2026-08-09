"use client";
import { aboutLong, experienceLong, projectsLong } from "@/content/longform";
import { useUIStore } from "@/stores/uiStore";
import { Terminal } from "./apps/Terminal";
import { TextViewer } from "./apps/TextViewer";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";

export function Desktop() {
  const windows = useUIStore((s) => s.windows);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-desktop-bg">
      <div className="absolute left-4 top-4 grid grid-cols-1 gap-3">
        <DesktopIcon id="terminal" title="Terminal" emoji="▶_" />
        <DesktopIcon id="about" title="About" emoji="👤" />
        <DesktopIcon id="projects" title="Projects" emoji="📁" />
        <DesktopIcon id="experience" title="Experience" emoji="💼" />
      </div>

      {windows.map((w) => (
        <Window key={w.id} window={w}>
          {w.id === "terminal" && <Terminal />}
          {w.id === "about" && <TextViewer content={aboutLong} />}
          {w.id === "projects" && <TextViewer content={projectsLong} />}
          {w.id === "experience" && <TextViewer content={experienceLong} />}
        </Window>
      ))}

      <Taskbar />
    </div>
  );
}
