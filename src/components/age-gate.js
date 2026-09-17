"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const STORAGE_KEY = "skinshowdown-age-confirmed";
const listeners = new Set();

function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return true;
}

function confirmAge() {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {}
  listeners.forEach((callback) => callback());
}

export default function AgeGate() {
  const confirmed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const confirmRef = useRef(null);
  const returnFocusRef = useRef(null);

  useEffect(() => {
    if (confirmed) return;
    returnFocusRef.current = document.activeElement;
    confirmRef.current?.focus();
    return () => {
      returnFocusRef.current?.focus?.();
    };
  }, [confirmed]);

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      confirmRef.current?.focus();
    }
  };

  if (confirmed) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Age verification"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-70 flex items-center justify-center p-6 bg-[rgba(4,6,9,0.96)]"
    >
      <div className="max-w-[440px] border border-hairline bg-card p-8 text-center">
        <div className="font-logo font-bold text-xl text-foreground mb-3.5">
          SKIN<span className="text-gold">SHOWDOWN</span>
        </div>
        <p className="text-sm leading-[1.7] text-tan mb-5.5">
          This store depicts cosmetics from a mature, horror-themed shooter. You
          must be 18 or older to enter.
        </p>
        <button
          ref={confirmRef}
          type="button"
          onClick={confirmAge}
          className="inline-block px-7 py-3 border border-gold bg-[#1a1f2e] text-[13px] font-semibold tracking-[0.14em] transition-all hover:bg-gold hover:text-background"
        >
          I AM 18 OR OLDER
        </button>
      </div>
    </div>
  );
}
