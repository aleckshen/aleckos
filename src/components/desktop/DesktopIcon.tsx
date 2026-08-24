"use client";
import { type AppId, useUIStore } from "@/stores/uiStore";
import type { MenuItem } from "./ContextMenu";

type Props = {
  id: AppId;
  title: string;
  emoji: string;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onContextMenu: (e: React.MouseEvent, items: MenuItem[]) => void;
};

export function DesktopIcon({
  id,
  title,
  emoji,
  selected,
  onSelect,
  onOpen,
  onContextMenu,
}: Props) {
  const openWindow = useUIStore((s) => s.openWindow);

  function open() {
    onOpen();
    openWindow(id, title);
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={open}
      // Right-clicking an icon selects it as well, the way Finder does.
      onContextMenu={(e) => {
        onSelect();
        onContextMenu(e, [{ kind: "item", label: "open", onSelect: open }]);
      }}
      className={`flex w-20 flex-col items-center gap-1 rounded p-2 text-xs text-terminal-fg ${selected ? "bg-white/10" : ""}`}
    >
      <span className="text-3xl">{emoji}</span>
      <span>{title}</span>
    </button>
  );
}
