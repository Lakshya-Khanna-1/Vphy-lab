import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useBrowserValue } from "./use-browser-value";

export function useLabDraft<T>(
  key: string,
  initial: T,
  validate: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const stored = useBrowserValue(key);
  let restored = initial;
  try {
    const value: unknown = JSON.parse(stored || "null");
    if (validate(value)) restored = value;
  } catch {
    /* A damaged draft must not prevent opening the lab. */
  }
  const [draft, setDraft] = useState<T | null>(null);
  useEffect(() => {
    if (draft === null) return;
    try {
      localStorage.setItem(key, JSON.stringify(draft));
    } catch {
      /* In-memory readings remain available for CSV export. */
    }
  }, [draft, key]);
  const update: Dispatch<SetStateAction<T>> = (next) =>
    setDraft((previous) =>
      typeof next === "function"
        ? (next as (value: T) => T)(previous ?? restored)
        : next,
    );
  return [draft ?? restored, update];
}
