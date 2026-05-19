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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function MomentItem({ item }: { item: BlogItemType }) {
  const date = formatDate(item.createdTime);
  const href = `/moments/${item.id}`;

  return (
    <article className="group py-6 first:pt-0 last:pb-0">
      <Link href={href}>
        <div className="mt-3 line-clamp-3  leading-7 text-[--text-soft]">
          {item.content}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[var(--text-muted)]">
          {date ? <time dateTime={item.createdTime}>{date}</time> : null}
          {item.categoryName ? (
            <span className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-2 py-0.5 text-[var(--text-soft)]">
              {item.categoryName}
            </span>
          ) : null}
          {
            <span className="inline-flex items-center gap-1">
              <Comments className="size-3.5" />
              <span>{item.commentCount}</span>
            </span>
          }
          {
            <span className="inline-flex items-center gap-1">
              <Likes className="size-3.5" />
              <span>{item.likes}</span>
            </span>
          }
        </div>
      </Link>

      {/* <Link
        href={href}
        className="mt-4 inline-flex text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
      >
        查看详情 & 评论
      </Link> */}
    </article>
  );
}
