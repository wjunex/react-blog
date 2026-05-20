export default function Loading() {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-6 animate-spin rounded-full border-2 border-(--border-strong) border-t-(--accent)" />
        <p className="text-sm text-(--text-muted)">加载中…</p>
      </div>
    </div>
  );
}
