import { BlogItem as BlogItemType } from "@/api/types";
import Link from "next/link";
import Comments from "@/assets/icons/comments.svg";
import Likes from "@/assets/icons/likes.svg";

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
  }).format(date);
}

export default function BlogItem({ item }: { item: BlogItemType }) {
  const date = formatDate(item.createdTime);
  const href = `/blog/${item.slug}`;

  return (
    <article className="group py-6 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[var(--text-muted)]">
        {date ? <time dateTime={item.createdTime}>{date}</time> : null}
        {item.categoryName ? (
          <span className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-2 py-0.5 text-[var(--text-soft)]">
            {item.categoryName}
          </span>
        ) : null}
        {item.textCount ? <span>{item.textCount} 字</span> : null}
        {item.views ? <span>{item.views} 阅读</span> : null}
        {item.commentCount != null && item.commentCount > 0 && (
          <span className="inline-flex items-center gap-1">
            <Comments className="size-3.5" />
            <span>{item.commentCount}</span>
          </span>
        )}
        {item.likes != null && item.likes > 0 && (
          <span className="inline-flex items-center gap-1">
            <Likes className="size-3.5" />
            <span>{item.likes}</span>
          </span>
        )}
      </div>
      <h2 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-[var(--text)]">
        <Link
          href={href}
          className="transition-colors group-hover:text-[var(--accent)]"
        >
          {item.title}
        </Link>
      </h2>
      {item.summary ? (
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--text-soft)]">
          {item.summary}
        </p>
      ) : null}
      <Link
        href={href}
        className="mt-4 inline-flex text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
      >
        阅读全文
      </Link>
    </article>
  );
}
