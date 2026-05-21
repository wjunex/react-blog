"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(login, null);

  useEffect(() => {
    if (state?.success) {
      router.push("/");
      router.refresh();
    }
  }, [state, router]);

  return (
    <section className="mx-auto max-w-sm space-y-8 py-12">
      <div className="border-b border-(--border) pb-6">
        <p className="text-sm font-medium text-(--accent)">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--text)">
          登录
        </h1>
      </div>

      <form action={formAction} className="space-y-5">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-(--text)"
          >
            手机号
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="请输入手机号"
            className="mt-1.5 block w-full rounded-lg border border-(--border-strong) bg-(--surface) px-3 py-2.5 text-sm text-(--text) placeholder:text-(--text-muted) focus:border-(--accent) focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-(--text)"
          >
            密码
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="请输入密码"
            className="mt-1.5 block w-full rounded-lg border border-(--border-strong) bg-(--surface) px-3 py-2.5 text-sm text-(--text) placeholder:text-(--text-muted) focus:border-(--accent) focus:outline-none"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-(--accent) px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "登录中..." : "登录"}
        </button>
      </form>
    </section>
  );
}
