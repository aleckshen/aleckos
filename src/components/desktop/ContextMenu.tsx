"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type MenuItem =
  | { kind: "item"; label: string; onSelect: () => void; disabled?: boolean }
  | { kind: "separator" };

type Props = {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
};

/** Gap kept between the menu and the edge of the screen. */
const MARGIN = 18;

/**
 * A right-click menu positioned at the cursor.
 *
 * Rendered only while open, so mounting is what makes it appear — the caller
 * holds the position and items and drops the component to dismiss it.
 */
export function ContextMenu({ x, y, items, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });

  // Measure after mount but before paint, so a menu opened near the right or
  // bottom edge flips back inside the viewport without visibly jumping.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setPos({
      x: Math.max(MARGIN, Math.min(x, window.innerWidth - width - MARGIN)),
      y: Math.max(MARGIN, Math.min(y, window.innerHeight - height - MARGIN)),
    });
  }, [x, y]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    // The contextmenu event that opened this doesn't produce a click, so the
    // listener can go on immediately without closing the menu it just opened.
    window.addEventListener("click", onClose);
    window.addEventListener("resize", onClose);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("click", onClose);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    // z-index sits above windows, whose own z-indexes climb every time one is
    // focused and would otherwise overtake a fixed value.
    <div
      ref={ref}
      role="menu"
      // p-1 on every side, so an item's highlight floats inset from the menu
      // border rather than running into it.
      className="fixed z-[9999] min-w-44 rounded-md border border-window-border bg-titlebar-bg/95 p-1 text-xs shadow-xl backdrop-blur"
      style={{ left: pos.x, top: pos.y }}
    >
      {items.map((item, i) =>
        item.kind === "separator" ? (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: separators carry no identity of their own
            key={`sep-${i}`}
            // -mx-1 cancels the menu's padding so the rule still spans edge to
            // edge while the items above and below stay inset.
            className="-mx-1 my-1 h-px bg-window-border"
          />
        ) : (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => {
              item.onSelect();
              onClose();
            }}
            className="block w-full rounded px-3 py-1.5 text-left text-terminal-fg hover:bg-white/10 disabled:cursor-default disabled:text-terminal-dim disabled:hover:bg-transparent"
          >
            {item.label}
          </button>
        ),
      )}
    </div>
  );
}
