"use client";
import { type AppId, useUIStore } from "@/stores/uiStore";

type Props = {
  id: AppId;
  title: string;
  emoji: string;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
};

export function DesktopIcon({
  id,
  title,
  emoji,
  selected,
  onSelect,
  onOpen,
}: Props) {
  const openWindow = useUIStore((s) => s.openWindow);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={() => {
        onOpen();
        openWindow(id, title);
      }}
      className={`flex w-20 flex-col items-center gap-1 rounded p-2 text-xs text-terminal-fg ${selected ? "bg-white/10" : ""}`}
    >
      <span className="text-3xl">{emoji}</span>
      <span>{title}</span>
    </button>
  );
}
