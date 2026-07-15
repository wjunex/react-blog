"use client";

import { useRouter } from "next/navigation";
import { apiNotifyDelete, apiNotifySetRead } from "@/api/generated";

export default function NotifyActions({ id, read }: { id: string; read?: boolean }) {
  const router = useRouter();

  const markRead = async () => {
    if (read) return;
    await apiNotifySetRead({ id });
    router.refresh();
  };

  const del = async () => {
    await apiNotifyDelete({ id });
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1 shrink-0">
      {!read && (
        <button
          onClick={markRead}
          className="text-xs text-(--text-muted) hover:text-(--accent) transition-colors"
        >
          已读
        </button>
      )}
      <button
        onClick={del}
        className="text-xs text-(--text-muted) hover:text-(--syntax-red) transition-colors"
      >
        删除
      </button>
    </div>
  );
}
