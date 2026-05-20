"use client";

import { useState, useRef, type ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
  /** 默认 top，可选 top | bottom | left | right */
  position?: "top" | "bottom" | "left" | "right";
}

const positionClasses: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1",
  left: "right-full top-1/2 -translate-y-1/2 mr-1",
  right: "left-full top-1/2 -translate-y-1/2 ml-1",
};

const arrowClasses: Record<string, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-4 border-x-4",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-4 border-x-4",
  left: "left-full top-1/2 -translate-y-1/2 border-l-4 border-y-4",
  right: "right-full top-1/2 -translate-y-1/2 border-r-4 border-y-4",
};

export default function Tooltip({
  text,
  children,
  position = "top",
}: TooltipProps) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function handleEnter() {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShow(true), 300);
  }

  function handleLeave() {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShow(false), 150);
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {children}

      {show && (
        <div
          role="tooltip"
          className={`absolute z-50 px-4 py-2 text-xs font-normal min-w-50 max-w-50  rounded border border-(--border-strong) bg-(--surface) text-(--text) shadow-(--shadow) pointer-events-none ${positionClasses[position]}`}
        >
          <div
            className="flex flex-col gap-1"
            dangerouslySetInnerHTML={{ __html: text }}
          />
          
          <div
            className={`absolute border-transparent ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
}
