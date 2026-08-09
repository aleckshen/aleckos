import { create } from "zustand";

export type AppId = "terminal" | "about" | "projects" | "experience";

export type WindowState = {
  id: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
};

type TerminalLine = { id: string; input: string; output: string };

type UIState = {
  windows: WindowState[];
  topZ: number;
  terminalHistory: TerminalLine[];

  openWindow: (id: AppId, title: string) => void;
  closeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  toggleMinimize: (id: AppId) => void;
  updateGeometry: (
    id: AppId,
    geom: Partial<Pick<WindowState, "x" | "y" | "width" | "height">>,
  ) => void;

  pushTerminalLine: (line: Omit<TerminalLine, "id">) => void;
  clearTerminal: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  windows: [],
  topZ: 1,
  terminalHistory: [],

  openWindow: (id, title) =>
    set((s) => {
      const existing = s.windows.find((w) => w.id === id);
      const newZ = s.topZ + 1;
      if (existing) {
        return {
          windows: s.windows.map((w) =>
            w.id === id ? { ...w, minimized: false, zIndex: newZ } : w,
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
            x: 80 + s.windows.length * 30,
            y: 60 + s.windows.length * 30,
            width: 640,
            height: 420,
            zIndex: newZ,
            minimized: false,
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

  pushTerminalLine: (line) =>
    set((s) => ({
      terminalHistory: [
        ...s.terminalHistory,
        { ...line, id: crypto.randomUUID() },
      ],
    })),
  clearTerminal: () => set({ terminalHistory: [] }),
}));
