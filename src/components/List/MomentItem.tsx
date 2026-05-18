import { BlogItem as BlogItemType } from "@/api/types";
import Link from "next/link";

function formatDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function MomentItem({ item }: { item: BlogItemType }) {
  const date = formatDate(item.createdTime);
  const href = `/moments/${item.id}`;

  return (
    <article className="group py-6 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[var(--text-muted)]">
        {date ? <time dateTime={item.createdTime}>{date}</time> : null}
        {item.categoryName ? (
          <span className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-2 py-0.5 text-[var(--text-soft)]">
            {item.categoryName}
          </span>
        ) : null}
      </div>
      <div className="mt-3 text-sm leading-7 text-[var(--text-soft)] whitespace-pre-wrap line-clamp-6">
        {item.content}
      </div>
      <Link
        href={href}
        className="mt-4 inline-flex text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
      >
        查看详情 & 评论
      </Link>
    </article>
  );
}
