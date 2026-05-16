import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-[#0969da]">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1f2328]">
        页面不存在
      </h1>
      <p className="mt-3 text-sm text-[#656d76]">
        这个地址可能已经移动，或者暂时没有公开。
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md border border-[#d0d7de] bg-[#f6f8fa] px-4 py-2 text-sm font-medium text-[#1f2328] transition-colors hover:bg-white hover:text-[#0969da]"
      >
        返回首页
      </Link>
    </div>
  );
}
