"use client";
import { useState } from "react";
import { Files } from "@/components/apps/Files";
import { Terminal } from "@/components/apps/Terminal";
import { TextViewer } from "@/components/apps/TextViewer";
import { aboutLong, experienceLong, projectsLong } from "@/content/longform";
import { type AppId, useUIStore } from "@/stores/uiStore";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";

export function Desktop() {
  const windows = useUIStore((s) => s.windows);
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: click-off-to-deselect convenience, not a real control
    // biome-ignore lint/a11y/useKeyWithClickEvents: no keyboard equivalent needed
    <div
      className="relative h-screen w-screen overflow-hidden bg-desktop-bg"
      onClick={() => setSelectedIcon(null)}
    >
      <div className="absolute left-4 top-4 grid grid-cols-1 gap-3">
        <DesktopIcon
          id="terminal"
          title="aleck's terminal"
          emoji=">_"
          selected={selectedIcon === "terminal"}
          onSelect={() => setSelectedIcon("terminal")}
          onOpen={() => setSelectedIcon(null)}
        />
        <DesktopIcon
          id="files"
          title="file manager"
          emoji="📁"
          selected={selectedIcon === "files"}
          onSelect={() => setSelectedIcon("files")}
          onOpen={() => setSelectedIcon(null)}
        />
      </div>

      {windows.map((w) => (
        <Window key={w.id} window={w}>
          {w.id === "terminal" && <Terminal />}
          {w.id === "files" && <Files />}
          {w.id === "about" && <TextViewer content={aboutLong} />}
          {w.id === "projects" && <TextViewer content={projectsLong} />}
          {w.id === "experience" && <TextViewer content={experienceLong} />}
        </Window>
      ))}

      <Taskbar />
    </div>
  );
}
