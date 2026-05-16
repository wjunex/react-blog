import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-[var(--accent)]">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">
        页面不存在
      </h1>
      <p className="mt-3 text-sm text-[var(--text-muted)]">
        这个地址可能已经移动，或者暂时没有公开。
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--accent)]"
      >
        返回首页
      </Link>
    </div>
  );
}
