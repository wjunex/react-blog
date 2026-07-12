"use client";

import { useState } from "react";
import { HelpCircleIcon, CloseIcon } from "@/components/Icons";

export default function RulesDialog({ rules, title = "规则" }: { rules: string; title?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex cursor-pointer text-(--text-muted) transition-colors hover:text-(--accent)"
        aria-label="查看规则"
      >
        <HelpCircleIcon />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          onClick={() => setOpen(false)}
        >
          {/* 遮罩 */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* 弹窗 */}
          <div
            className="relative w-full max-w-md rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-(--text)">
                {title}
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-(--text-muted) transition-colors hover:bg-(--surface-muted) hover:text-(--text)"
                aria-label="关闭"
              >
                <CloseIcon />
              </button>
            </div>
            <div
              className="space-y-2 text-sm leading-6 text-(--text-soft)"
              dangerouslySetInnerHTML={{ __html: rules }}
            />
          </div>
        </div>
      )}
    </>
  );
}
