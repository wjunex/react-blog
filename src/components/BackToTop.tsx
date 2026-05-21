"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@/components/Icons";

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
      <ArrowUpIcon />
    </button>
  );
}
