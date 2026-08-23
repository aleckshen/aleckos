import { create } from "zustand";
import type { DocId } from "@/content/documents";

export type AppId = "terminal" | "files" | DocId;

export type WindowState = {
  id: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prevGeometry?: { x: number; y: number; width: number; height: number };
};

/** `help` renders as a two-column layout rather than text, so it can't be a string. */
export type TerminalOutput = { kind: "text"; text: string } | { kind: "help" };

type TerminalLine = { id: string; input: string; output: TerminalOutput };

export type BootPhase = "locked" | "booting" | "ready";

type UIState = {
  windows: WindowState[];
  topZ: number;
  terminalHistory: TerminalLine[];
  bootPhase: BootPhase;

  setBootPhase: (phase: BootPhase) => void;
  openWindow: (
    id: AppId,
    title: string,
    opts?: { maximized?: boolean },
  ) => void;
  closeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  toggleMinimize: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  updateGeometry: (
    id: AppId,
    geom: Partial<Pick<WindowState, "x" | "y" | "width" | "height">>,
  ) => void;

  pushTerminalLine: (line: Omit<TerminalLine, "id">) => void;
  clearTerminal: () => void;
};

/** Matches Tailwind's `md`, below which floating windows stop fitting. */
const MOBILE_BREAKPOINT = 768;
/** Height of the taskbar (h-12), which windows shouldn't sit under. */
const TASKBAR_HEIGHT = 48;
/** Fraction of the available space a new window takes on mobile. */
const MOBILE_WIDTH_RATIO = 0.82;
const MOBILE_HEIGHT_RATIO = 0.5;

/**
 * Where a newly opened window should sit.
 *
 * Only ever called from event handlers, never during render, so reading the
 * viewport here can't cause a hydration mismatch.
 */
function defaultGeometry(openCount: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // On phones a 640px window is wider than the screen, and cascading offsets
  // just push it further off. Windows can't be dragged or resized there, so
  // keep them clearly smaller than the screen and centred, leaving enough
  // desktop visible that it still reads as a window rather than a page.
  if (vw < MOBILE_BREAKPOINT) {
    const available = vh - TASKBAR_HEIGHT;
    const width = Math.round(vw * MOBILE_WIDTH_RATIO);
    const height = Math.round(available * MOBILE_HEIGHT_RATIO);
    return {
      x: Math.round((vw - width) / 2),
      y: Math.round((available - height) / 2),
      width,
      height,
    };
  }

  return {
    x: 80 + openCount * 30,
    y: 60 + openCount * 30,
    width: 640,
    height: 420,
  };
}

export const useUIStore = create<UIState>((set) => ({
  windows: [],
  topZ: 1,
  terminalHistory: [],
  // Flip to "ready" while working on the desktop to skip the boot flow.
  bootPhase: "locked",

  setBootPhase: (phase) => set({ bootPhase: phase }),

  openWindow: (id, title, opts) =>
    set((s) => {
      const existing = s.windows.find((w) => w.id === id);
      const newZ = s.topZ + 1;
      if (existing) {
        return {
          windows: s.windows.map((w) =>
            w.id === id
              ? {
                  ...w,
                  minimized: false,
                  zIndex: newZ,
                  maximized: opts?.maximized ?? w.maximized,
                }
              : w,
          ),
          topZ: newZ,
        };
      }
      return {
        windows: [
          ...s.windows,
          {
            id,
            title,
            ...defaultGeometry(s.windows.length),
            zIndex: newZ,
            minimized: false,
            maximized: opts?.maximized ?? false,
          },
        ],
        topZ: newZ,
      };
    }),

  closeWindow: (id) =>
    set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),

  focusWindow: (id) =>
    set((s) => {
      const newZ = s.topZ + 1;
      return {
        windows: s.windows.map((w) =>
          w.id === id ? { ...w, zIndex: newZ, minimized: false } : w,
        ),
        topZ: newZ,
      };
    }),

  toggleMinimize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, minimized: !w.minimized } : w,
      ),
    })),

  updateGeometry: (id, geom) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, ...geom } : w)),
    })),

  toggleMaximize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          return {
            ...w,
            ...(w.prevGeometry ?? {}),
            maximized: false,
            prevGeometry: undefined,
          };
        }
        return {
          ...w,
          maximized: true,
          prevGeometry: { x: w.x, y: w.y, width: w.width, height: w.height },
        };
      }),
    })),

  pushTerminalLine: (line) =>
    set((s) => ({
      terminalHistory: [
        ...s.terminalHistory,
        { ...line, id: crypto.randomUUID() },
      ],
    })),
  clearTerminal: () => set({ terminalHistory: [] }),
}));
