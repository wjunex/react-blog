"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const storageKey = "theme";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const t = getPreferredTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";

    const apply = () => {
      setTheme(next);
      applyTheme(next);
      window.localStorage.setItem(storageKey, next);
    };

    document.documentElement.classList.add("theme-transitioning");
    const applyAndClean = () => {
      apply();
      setTimeout(() => document.documentElement.classList.remove("theme-transitioning"), 300);
    };

    if ("startViewTransition" in document) {
      (document as any).startViewTransition(() => apply());
    } else {
      applyAndClean();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
      className="p-2 text-(--text-soft) transition-colors hover:text-(--accent)"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
