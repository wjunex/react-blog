"use client";

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
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs rounded-lg border border-(--border) text-(--text-soft) hover:bg-(--surface-muted) transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-3 py-1.5 text-xs rounded-lg text-white transition-opacity disabled:opacity-50 ${
              danger ? "bg-(--syntax-red) hover:opacity-85" : "bg-(--accent) hover:opacity-85"
            }`}
          >
            {loading ? "处理中..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
