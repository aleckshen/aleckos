"use client";

type Props = {
  lines: string[];
  className?: string;
};

/**
 * The BIOS screen's markup only — no timers, no state.
 *
 * Split out from BootSequence so the same visuals can be rendered as a static
 * layer on top of the desktop and faded out, which is what makes the hand-off
 * a crossfade instead of a cut to black.
 */
export function BootScreen({ lines, className = "" }: Props) {
  return (
    <div
      className={`h-screen w-screen overflow-hidden bg-black p-4 text-sm ${className}`}
    >
      {lines.map((line, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed list, never reordered
        <pre key={i} className="whitespace-pre-wrap leading-6">
          {line}
        </pre>
      ))}
    </div>
  );
}
