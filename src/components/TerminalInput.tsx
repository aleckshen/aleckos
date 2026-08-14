"use client";
import { useState } from "react";

type Props = {
  /** Must match the htmlFor of the wrapping label, so clicking focuses this. */
  id: string;
  value: string;
  onChange: (value: string) => void;
};

/**
 * A text input styled as a terminal prompt: the native caret is hidden and
 * replaced with a blinking block that tracks the real cursor position and
 * only shows while the input is focused.
 */
export function TerminalInput({ id, value, onChange }: Props) {
  const [caret, setCaret] = useState(0);

  // Clamped so the block snaps back when the parent clears the value.
  const caretPos = Math.min(caret, value.length);

  function syncCaret(el: HTMLInputElement) {
    setCaret(el.selectionStart ?? el.value.length);
  }

  return (
    <span className="relative h-5 flex-1">
      <input
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          syncCaret(e.target);
        }}
        onClick={(e) => syncCaret(e.currentTarget)}
        onKeyUp={(e) => syncCaret(e.currentTarget)}
        onSelect={(e) => syncCaret(e.currentTarget)}
        className="peer w-full bg-transparent caret-transparent outline-none"
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
      <span
        aria-hidden="true"
        className="cursor-blink invisible pointer-events-none absolute top-1/2 h-4 w-[0.75ch] -translate-y-1/2 bg-current peer-focus:visible"
        style={{ left: `${caretPos}ch` }}
      />
    </span>
  );
}
