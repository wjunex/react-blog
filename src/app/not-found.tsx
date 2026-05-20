import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-(--accent)">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--text)">
        页面不存在
      </h1>
      <p className="mt-3 text-sm text-(--text-muted)">
        这个地址可能已经移动，或者暂时没有公开。
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md border border-(--border-strong) bg-(--surface-muted) px-4 py-2 text-sm font-medium text-(--text) transition-colors hover:bg-(--surface) hover:text-(--accent)"
      >
        返回首页
      </Link>
    </div>
  );
}
