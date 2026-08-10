"use client";
import { useEffect, useState } from "react";
import { useUIStore } from "@/stores/uiStore";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function Taskbar() {
  const { windows, focusWindow, toggleMinimize } = useUIStore();
  const now = useClock();

  return (
    <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-between border-t border-window-border bg-taskbar-bg px-3 text-sm">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-terminal-dim">aleckos</span>
        <span className="h-4 w-px bg-window-border" />
        <div className="flex gap-2">
          {windows.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() =>
                w.minimized ? focusWindow(w.id) : toggleMinimize(w.id)
              }
              className={`rounded px-3 py-1 ${w.minimized ? "text-terminal-dim" : "bg-window-bg text-terminal-fg"}`}
            >
              {w.title}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="h-4 w-px bg-window-border" />
        <span className="text-terminal-dim">
          {now?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
