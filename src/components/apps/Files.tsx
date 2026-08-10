"use client";
import { type AppId, useUIStore } from "@/stores/uiStore";

const files: { id: AppId; title: string; name: string }[] = [
  { id: "about", title: "About", name: "about.md" },
  { id: "projects", title: "Projects", name: "projects.md" },
  { id: "experience", title: "Experience", name: "experience.md" },
];

export function Files() {
  const openWindow = useUIStore((s) => s.openWindow);
  return (
    <div className="h-full text-sm">
      <div className="border-b border-window-border px-3 py-1.5 text-xs text-terminal-dim">
        ~/documents
      </div>
      <div>
        {files.map((f) => (
          <button
            key={f.id}
            type="button"
            onDoubleClick={() => openWindow(f.id, f.title)}
            className="block w-full px-3 py-1.5 text-left text-terminal-fg hover:bg-white/10"
          >
            {f.name}
          </button>
        ))}
      </div>
    </div>
  );
}
