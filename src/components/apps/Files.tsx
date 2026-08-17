"use client";
import { documents } from "@/content/documents";
import { useUIStore } from "@/stores/uiStore";

export function Files() {
  const openWindow = useUIStore((s) => s.openWindow);
  return (
    <div className="h-full text-sm">
      <div className="border-b border-window-border px-3 py-1.5 text-terminal-dim">
        ~/documents
      </div>
      <div>
        {documents.map((d) => (
          <button
            key={d.id}
            type="button"
            onDoubleClick={() => openWindow(d.id, d.title)}
            className="block w-full px-3 py-1.5 text-left text-terminal-fg hover:bg-white/10"
          >
            {d.file}
          </button>
        ))}
      </div>
    </div>
  );
}
