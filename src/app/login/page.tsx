"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useActionState, useEffect } from "react";
import { login } from "@/lib/auth";
import Button from "@/components/Button";
import { setTokens } from "@/lib/token";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(login, null);

  useEffect(() => {
    if (state?.success && state.accessToken && state.refreshToken) {
      setTokens(state.accessToken, state.refreshToken);
      const redirectTo = searchParams.get("redirectTo") || "/";
      router.push(redirectTo);
      router.refresh();
    }
  }, [state, router, searchParams]);

  return (
    <section className="mx-auto max-w-sm space-y-8 py-12">
      <div className="border-b border-(--border) pb-6">
        <p className="text-sm font-medium text-(--accent)">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-(--text)">
          登录
        </h1>
      </div>

      <form action={formAction} className="space-y-5">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-(--text)"
          >
            账号
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="请输入管理员账号"
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
            placeholder="请输入管理员密码"
            className="mt-1.5 block w-full rounded-lg border border-(--border-strong) bg-(--surface) px-3 py-2.5 text-sm text-(--text) placeholder:text-(--text-muted) focus:border-(--accent) focus:outline-none"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}

        <Button type="submit" disabled={isPending} size="md" className="w-full">
          {isPending ? "登录中..." : "登录"}
        </Button>
      </form>
    </section>
  );
}
