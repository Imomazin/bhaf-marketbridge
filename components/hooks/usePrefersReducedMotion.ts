"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function getSnapshot(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.(QUERY).matches;
}

function getServerSnapshot(): boolean {
  // Default to false on server so we render the animated path; the
  // client will swap to true on first paint if the user prefers reduced
  // motion, and our consumers gate the animation accordingly.
  return false;
}

function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

/**
 * React 19-friendly hook that reads `prefers-reduced-motion` without
 * needing a useEffect → setState bootstrap (which the React Compiler
 * flags as set-state-in-effect).
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
