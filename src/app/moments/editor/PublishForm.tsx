"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { publishMoment } from "@/lib/auth";
import Button from "@/components/Button";

interface Props {
  initialContent?: string;
  id?: string;
}

export default function PublishForm({ initialContent = "", id }: Props) {
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
      {id && <input type="hidden" name="id" value={id} />}
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
          defaultValue={initialContent}
          placeholder="写点什么..."
          className="mt-1.5 block w-full rounded-lg border border-(--border-strong) bg-(--surface) px-3 py-2.5 text-sm text-(--text) placeholder:text-(--text-muted) focus:border-(--accent) focus:outline-none resize-y"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending} size="md">
          {isPending ? "发布中..." : id ? "保存" : "发布"}
        </Button>
        <Button variant="ghost" size="md" onClick={() => router.push("/moments")}>
          取消
        </Button>
      </div>
    </form>
  );
}
