"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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

  const stripRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const syncArrows = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    // -1 absorbs sub-pixel rounding, which would otherwise leave the right
    // arrow showing when already scrolled to the end.
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  // Recheck when tabs are added or removed, and when the viewport resizes.
  useEffect(() => {
    syncArrows();
    window.addEventListener("resize", syncArrows);
    return () => window.removeEventListener("resize", syncArrows);
  }, [syncArrows]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure whenever the tab list changes
  useEffect(syncArrows, [windows.length, syncArrows]);

  function scrollBy(direction: 1 | -1) {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.6, behavior: "smooth" });
  }

  return (
    <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-between border-t border-window-border bg-taskbar-bg px-3 text-sm">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="shrink-0 font-semibold text-terminal-dim">
          aleckos
        </span>
        <span className="h-4 w-px shrink-0 bg-window-border" />

        {canScrollLeft && (
          <button
            type="button"
            aria-label="Scroll tabs left"
            onClick={() => scrollBy(-1)}
            className="shrink-0 px-1 text-terminal-dim transition-colors hover:text-terminal-fg"
          >
            ‹
          </button>
        )}

        <div
          ref={stripRef}
          onScroll={syncArrows}
          className="no-scrollbar flex min-w-0 items-center gap-3 overflow-x-auto"
        >
          {windows.map((w) => (
            <div key={w.id} className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  w.minimized ? focusWindow(w.id) : toggleMinimize(w.id)
                }
                className={`whitespace-nowrap transition-colors ${w.minimized ? "text-terminal-dim hover:text-terminal-fg" : "text-terminal-fg"}`}
              >
                {w.title}
              </button>
              <span className="h-4 w-px bg-window-border" />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            aria-label="Scroll tabs right"
            onClick={() => scrollBy(1)}
            className="shrink-0 px-1 text-terminal-dim transition-colors hover:text-terminal-fg"
          >
            ›
          </button>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 pl-3">
        <span className="h-4 w-px bg-window-border" />
        <span className="text-terminal-dim">
          {now?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
