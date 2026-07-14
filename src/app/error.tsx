"use client";

import Button from "@/components/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-(--accent)">Error</p>
      <h1 className="mt-2 text-2xl font-semibold text-(--text)">
        加载失败
      </h1>
      <p className="mt-3 text-sm text-(--text-muted)">
        {error.message || "页面加载时出现错误，请稍后重试。"}
      </p>
      <div className="mt-6">
        <Button variant="secondary" size="md" onClick={reset}>
          重新加载
        </Button>
      </div>
    </div>
  );
}
