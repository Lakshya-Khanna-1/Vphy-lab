"use client";

import React from "react";

export function ResetLabButton({ draftKey }: { draftKey?: string }) {
  const handleReset = () => {
    if (
      confirm(
        "Reset current experiment? All logged measurements and positions will be lost.",
      )
    ) {
      if (draftKey) {
        try {
          localStorage.removeItem(draftKey);
        } catch {
          alert(
            "The saved draft could not be cleared. Allow browser storage and try again.",
          );
          return;
        }
      }
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleReset}
      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-none text-sm font-medium transition  text-slate-100 flex items-center gap-2 group"
    >
      <svg
        className="w-4 h-4 text-emerald-500 group-hover:rotate-180 transition-transform duration-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Reset Lab
    </button>
  );
}
