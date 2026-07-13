"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiNoteDelete } from "@/api/generated";

interface Props {
  id: string;
  redirectTo: string;
}

export default function DeleteArticleButton({ id, redirectTo }: Props) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const doDelete = async () => {
    setDeleting(true);
    try {
      await apiNoteDelete({ id });
      router.push(redirectTo);
      router.refresh();
    } catch {
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="text-xs text-(--text-muted) hover:text-(--syntax-red) transition-colors"
      >
        删除
      </button>

      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShow(false)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-(--surface) border border-(--border) rounded-xl p-6 shadow-lg max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-(--text)">确定删除这篇文章？此操作不可撤销。</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShow(false)}
                className="px-3 py-1.5 text-xs rounded-lg border border-(--border) text-(--text-soft) hover:bg-(--surface-muted) transition-colors"
              >
                取消
              </button>
              <button
                onClick={doDelete}
                disabled={deleting}
                className="px-3 py-1.5 text-xs rounded-lg bg-(--syntax-red) text-white hover:opacity-85 transition-opacity disabled:opacity-50"
              >
                {deleting ? "删除中..." : "删除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
