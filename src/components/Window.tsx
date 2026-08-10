"use client";
import { Rnd } from "react-rnd";
import { useUIStore, type WindowState } from "@/stores/uiStore";

type Props = {
  window: WindowState;
  children: React.ReactNode;
};

export function Window({ window, children }: Props) {
  const {
    closeWindow,
    focusWindow,
    toggleMinimize,
    toggleMaximize,
    updateGeometry,
  } = useUIStore();

  if (window.minimized) return null;

  return (
    <Rnd
      size={
        window.maximized
          ? { width: "100%", height: "100%" }
          : { width: window.width, height: window.height }
      }
      position={
        window.maximized ? { x: 0, y: 0 } : { x: window.x, y: window.y }
      }
      minWidth={320}
      minHeight={200}
      bounds="parent"
      disableDragging={window.maximized}
      enableResizing={!window.maximized}
      dragHandleClassName="window-drag-handle"
      onDragStop={(_, d) => updateGeometry(window.id, { x: d.x, y: d.y })}
      onResizeStop={(_, __, ref, ___, pos) =>
        updateGeometry(window.id, {
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
          x: pos.x,
          y: pos.y,
        })
      }
      style={{ zIndex: window.zIndex }}
      onMouseDown={() => focusWindow(window.id)}
    >
      <div className="flex h-full flex-col rounded-md border border-window-border bg-window-bg shadow-xl">
        <div className="window-drag-handle relative flex items-center bg-titlebar-bg px-3 py-1.5 text-sm">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => closeWindow(window.id)}
              className="h-3 w-3 rounded-full bg-red-500"
            />
            <button
              type="button"
              onClick={() => toggleMinimize(window.id)}
              className="h-3 w-3 rounded-full bg-yellow-500"
            />
            <button
              type="button"
              onClick={() => toggleMaximize(window.id)}
              className="h-3 w-3 rounded-full bg-green-500"
            />
          </div>
          <span className="pointer-events-none absolute inset-x-0 text-center text-terminal-fg">
            {window.title}
          </span>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </Rnd>
  );
}
