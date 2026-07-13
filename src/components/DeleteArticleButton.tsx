"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiNoteDelete } from "@/api/generated";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
  id: string;
  redirectTo?: string;
  message?: string;
  onDeleted?: () => void;
}

export default function DeleteArticleButton({ id, redirectTo, message = "确定删除这篇文章？此操作不可撤销。", onDeleted }: Props) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const doDelete = async () => {
    setDeleting(true);
    try {
      await apiNoteDelete({ id });
      onDeleted?.();
      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
      }
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
      <ConfirmDialog
        open={show}
        onClose={() => setShow(false)}
        onConfirm={doDelete}
        confirmLabel="删除"
        loading={deleting}
      >
        {message}
      </ConfirmDialog>
    </>
  );
}
