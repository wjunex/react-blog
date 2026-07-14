"use client";

import Button from "@/components/Button";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  loading?: boolean;
  confirmLabel?: string;
  danger?: boolean;
  children: React.ReactNode;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  loading,
  confirmLabel = "确认",
  danger = true,
  children,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative bg-(--surface) border border-(--border) rounded-xl p-6 shadow-lg max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <p className="text-sm font-semibold text-(--text) mb-2">{title}</p>}
        <div className="text-sm text-(--text)">{children}</div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            取消
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "处理中..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
