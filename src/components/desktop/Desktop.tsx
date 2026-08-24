"use client";
import { useState } from "react";
import { Files } from "@/components/apps/Files";
import { Terminal } from "@/components/apps/Terminal";
import { TextViewer } from "@/components/apps/TextViewer";
import { documents } from "@/content/documents";
import { type AppId, useUIStore } from "@/stores/uiStore";
import { ContextMenu, type MenuItem } from "./ContextMenu";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";

/** Maps a window id to whatever should render inside it. */
function WindowContent({ id }: { id: AppId }) {
  if (id === "terminal") return <Terminal />;
  if (id === "files") return <Files />;

  const doc = documents.find((d) => d.id === id);
  return doc?.kind === "markdown" ? <TextViewer content={doc.content} /> : null;
}

type Menu = { x: number; y: number; items: MenuItem[] };

export function Desktop() {
  const windows = useUIStore((s) => s.windows);
  const openWindow = useUIStore((s) => s.openWindow);
  const closeAllWindows = useUIStore((s) => s.closeAllWindows);
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);

  function openMenu(e: React.MouseEvent, items: MenuItem[]) {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, items });
  }

  const desktopMenu: MenuItem[] = [
    {
      kind: "item",
      label: "open terminal",
      onSelect: () => openWindow("terminal", "aleck's terminal"),
    },
    {
      kind: "item",
      label: "open file manager",
      onSelect: () => openWindow("files", "file manager"),
    },
    { kind: "separator" },
    {
      kind: "item",
      label: "close all windows",
      onSelect: closeAllWindows,
      disabled: windows.length === 0,
    },
  ];

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: click-off-to-deselect convenience, not a real control
    // biome-ignore lint/a11y/useKeyWithClickEvents: no keyboard equivalent needed
    <div
      className="relative h-dvh w-screen overflow-hidden bg-desktop-bg"
      onClick={() => setSelectedIcon(null)}
      // Only bare desktop, never a right-click that bubbled up from a window
      // or the taskbar — those keep the browser's own menu so text stays
      // copyable and links keep their "open in new tab".
      onContextMenu={(e) => {
        if (e.target !== e.currentTarget) return;
        setSelectedIcon(null);
        openMenu(e, desktopMenu);
      }}
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
          <WindowContent id={w.id} />
        </Window>
      ))}

      <Taskbar />

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          items={menu.items}
          onClose={() => setMenu(null)}
        />
      )}
    </div>
  );
}
