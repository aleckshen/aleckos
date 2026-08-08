"use client";
import { Rnd } from "react-rnd";
import { useUIStore, type WindowState } from "@/stores/uiStore";

type Props = {
  window: WindowState;
  children: React.ReactNode;
};

export function Window({ window, children }: Props) {
  const { closeWindow, focusWindow, toggleMinimize, updateGeometry } =
    useUIStore();

  if (window.minimized) return null;

  return (
    <Rnd
      size={{ width: window.width, height: window.height }}
      position={{ x: window.x, y: window.y }}
      minWidth={320}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="window-drag-handle"
      onDragStop={(_, d) => updateGeometry(window.id, { x: d.x, y: d.y })}
      onResizeStop={(_, __, ref, ___, pos) =>
        updateGeometry(window.id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          x: pos.x,
          y: pos.y,
        })
      }
      style={{ zIndex: window.zIndex }}
      onMouseDown={() => focusWindow(window.id)}
    >
      <div className="flex h-full flex-col rounded-md border border-window-border bg-window-bg shadow-xl">
        <div className="window-drag-handle flex items-center justify-between bg-titlebar-bg px-3 py-1.5 text-sm">
          <span className="text-terminal-fg">{window.title}</span>
          <div className="flex gap-2">
            <button
              onClick={() => toggleMinimize(window.id)}
              className="h-3 w-3 rounded-full bg-yellow-500"
            />
            <button
              onClick={() => closeWindow(window.id)}
              className="h-3 w-3 rounded-full bg-red-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </Rnd>
  );
}
