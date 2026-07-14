import { ButtonLink } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-(--accent)">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-(--text)">
        页面不存在
      </h1>
      <p className="mt-3 text-sm text-(--text-muted)">
        这个地址可能已经移动，或者暂时没有公开。
      </p>
      <div className="mt-6">
        <ButtonLink href="/" variant="secondary" size="md">
          返回首页
        </ButtonLink>
      </div>
    </div>
  );
}
