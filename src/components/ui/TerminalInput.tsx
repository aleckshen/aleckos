"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  /** Must match the htmlFor of the wrapping label, so clicking focuses this. */
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Focus the input as soon as it mounts. */
  focusOnMount?: boolean;
};

/**
 * A text input styled as a terminal prompt: the native caret is hidden and
 * replaced with a blinking block that tracks the real cursor position and
 * only shows while the input is focused.
 */
export function TerminalInput({
  id,
  value,
  onChange,
  focusOnMount = false,
}: Props) {
  const [caret, setCaret] = useState(0);
  // How far the input has scrolled itself once the text outgrows the box.
  const [scrollLeft, setScrollLeft] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clamped so the block snaps back when the parent clears the value.
  const caretPos = Math.min(caret, value.length);

  useEffect(() => {
    if (focusOnMount) inputRef.current?.focus();
  }, [focusOnMount]);

  function syncCaret(el: HTMLInputElement) {
    setCaret(el.selectionStart ?? el.value.length);
    setScrollLeft(el.scrollLeft);
  }

  return (
    <span className="relative h-6 flex-1 overflow-hidden md:h-5">
      <input
        id={id}
        ref={inputRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          syncCaret(e.target);
        }}
        onClick={(e) => syncCaret(e.currentTarget)}
        onKeyUp={(e) => syncCaret(e.currentTarget)}
        onSelect={(e) => syncCaret(e.currentTarget)}
        onScroll={(e) => setScrollLeft(e.currentTarget.scrollLeft)}
        // Desktop only: hide the native caret (the block replaces it) and leave
        // room at the right edge for the block to render once text scrolls.
        // Mobile keeps the native caret, since virtual keyboards don't fire the
        // selection events the block relies on to track position.
        className="peer w-full bg-transparent outline-none md:w-[calc(100%-0.75ch)] md:caret-transparent"
        spellCheck={false}
        // Password managers ignore autoComplete="off" on anything that looks
        // like a login, so these opt out of 1Password and LastPass explicitly.
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        data-1p-ignore
        data-lpignore="true"
        data-form-type="other"
      />
      <span
        aria-hidden="true"
        className="cursor-blink invisible pointer-events-none absolute top-1/2 h-4 w-[0.75ch] -translate-y-1/2 bg-current md:peer-focus:visible"
        style={{ left: `calc(${caretPos}ch - ${scrollLeft}px)` }}
      />
    </span>
  );
}
