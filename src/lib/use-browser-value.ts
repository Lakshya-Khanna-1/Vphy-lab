"use client";
import { useSyncExternalStore } from "react";
const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("vphy-browser-change", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("vphy-browser-change", callback);
    window.removeEventListener("popstate", callback);
  };
};
export function useBrowserValue(key: string) {
  return useSyncExternalStore(
    subscribe,
    () => {
      try {
        return key === "location-search"
          ? window.location.search
          : localStorage.getItem(key) || "";
      } catch {
        return "";
      }
    },
    () => "",
  );
}
