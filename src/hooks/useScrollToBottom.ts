"use client";
import { useEffect, useRef } from "react";

/**
 * Keeps a scroll container pinned to the bottom as content is added.
 *
 * The effect deliberately has no dependency array: it runs after every render,
 * so newly appended lines scroll into view without the caller having to track
 * what changed. Attach the returned ref to the element that actually scrolls
 * (the one with `overflow-y-auto`), not an inner wrapper.
 */
export function useScrollToBottom<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  });

  return ref;
}
