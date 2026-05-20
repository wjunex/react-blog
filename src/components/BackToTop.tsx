"use client";

import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 300;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="返回顶部"
      className={`fixed bottom-6 right-6 z-50 flex size-10 items-center justify-center rounded-full border border-(--border-strong) bg-(--surface) text-(--text-muted) shadow-[var(--shadow)] transition-all hover:border-(--accent) hover:text-(--accent) ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <path d="M8 14V3" />
        <path d="M3 7l5-5 5 5" />
      </svg>
    </button>
  );
}
