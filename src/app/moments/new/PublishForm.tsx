"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { publishMoment } from "@/lib/auth";

export default function PublishForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(publishMoment, null);

  useEffect(() => {
    if (state?.success) {
      router.push("/moments");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-(--text)"
        >
          内容
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={6}
          placeholder="写点什么..."
          className="mt-1.5 block w-full rounded-lg border border-(--border-strong) bg-(--surface) px-3 py-2.5 text-sm text-(--text) placeholder:text-(--text-muted) focus:border-(--accent) focus:outline-none resize-y"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-(--accent) px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "发布中..." : "发布"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/moments")}
          className="rounded-lg border border-(--border-strong) bg-(--surface) px-4 py-2.5 text-sm font-medium text-(--text-soft) transition-colors hover:text-(--accent)"
        >
          取消
        </button>
      </div>
    </form>
  );
}
